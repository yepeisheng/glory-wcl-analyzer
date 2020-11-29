import XLSX from "xlsx";

function convertCellColName(colIdx) {
  let curIdx = colIdx;
  let output = "";
  do {
    output = `${String.fromCharCode((curIdx % 26) + 65)}${output}`;
    curIdx = Math.floor(curIdx / 26) - 1;
  } while (curIdx > -1);
  return output;
}

export function downloadFile(
  allScores,
  downloadMode,
  reportId,
  reportName,
  reportDate
) {
  if (downloadMode === "filePerClass") {
    allScores
      .filter(s => s.scores.length > 0)
      .forEach(scoresObj => {
        const score = scoresObj.scores;
        const filename = `${reportName}-${reportDate}-${scoresObj.className}.xlsx`;
        const wb = XLSX.utils.book_new();

        const ws = convertToSheet(
          score,
          scoresObj.className,
          reportName,
          reportDate
        );
        XLSX.utils.book_append_sheet(wb, ws, scoresObj.className);
        XLSX.writeFile(wb, filename);
      });
  } else if (downloadMode === "sheetPerClass") {
    const wb = XLSX.utils.book_new();
    allScores
      .filter(s => s.scores.length > 0)
      .reduce((wb, scoresObj) => {
        const score = scoresObj.scores;
        const ws = convertToSheet(
          score,
          scoresObj.className,
          reportName,
          reportDate
        );
        XLSX.utils.book_append_sheet(wb, ws, scoresObj.className);
        return wb;
      }, wb);
    XLSX.writeFile(wb, `${reportName}-${reportDate}.xlsx`);
  } else if (downloadMode === "singleSheet") {
    const output = allScores
      .filter(s => s.scores.length > 0)
      .map(scoreObject => {
        const score = scoreObject.scores;
        const headers = convertHeaders(score);
        const items = convertItems(score);
        const headersData = headers.map(h => h.text);
        const itemData = items
          .map(i => headers.map(h => i[h.value]))
          .map(item => {
            item.splice(1, 0, scoreObject.classType);
            return item;
          });

        headers.splice(1, 0, {
          text: "职业",
          align: "start",
          sortable: false,
          value: "classType"
        });
        headersData.splice(1, 0, "职业");

        const colNum = headersData.length - 2;
        return {
          headers,
          headersData,
          itemData,
          colNum
        };
      })
      .reduce(
        (output, { headers, headersData, itemData, colNum }) => {
          const preScoreColNum = output["baseNum"];
          const outputHeadersData = output["headersData"].concat(
            ...headersData.splice(2, headersData.length)
          );
          const preItemData =
            output["itemData"].length > 0
              ? output["itemData"].map(item =>
                  item.concat(new Array(colNum).fill(0))
                )
              : output["itemData"];
          const curItemData = itemData.map(item => {
            item.splice(3, 0, ...new Array(preScoreColNum).fill(0));
            return item;
          });

          const { roundTotalFormula, layerFormula } = convertFormula(
            headers,
            3,
            preScoreColNum
          );

          curItemData.forEach((i, playerIdx) => {
            const totalCell = `C${preItemData.length + playerIdx + 2}`;
            output["allFormulas"].push({
              cellName: totalCell,
              cellFormula: roundTotalFormula.replaceAll(
                "{playerIdx}",
                preItemData.length + playerIdx + 2
              )
            });

            layerFormula.forEach(l => {
              const layerCell = `${convertCellColName(
                l.idx
              )}${preItemData.length + playerIdx + 2}`;
              output["allFormulas"].push({
                cellName: layerCell,
                cellFormula: l.formula.replaceAll(
                  "{playerIdx}",
                  preItemData.length + playerIdx + 2
                )
              });
            });
          });
          return {
            headersData: outputHeadersData,
            itemData: preItemData.concat(curItemData),
            allFormulas: output["allFormulas"],
            baseNum: preScoreColNum + colNum
          };
        },
        {
          headersData: ["名字", "职业"],
          itemData: [],
          allFormulas: [],
          baseNum: 0
        }
      );

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(
      [output["headersData"]].concat(output["itemData"])
    );
    output["allFormulas"].forEach(f => {
      ws[f["cellName"]] = {
        f: f["cellFormula"]
      };
    });

    XLSX.utils.book_append_sheet(wb, ws, "ALL");
    XLSX.writeFile(wb, `${reportId}.xlsx`);
  }
}

function convertFormula(headers, startCol, preScoreColNum) {
  const layers = [];
  let curLayer = null;
  let idx = startCol + preScoreColNum;
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    if (header.value.indexOf("group") === 0) {
      curLayer = {
        idx: idx,
        weight: header.weight,
        subLayers: []
      };
      layers.push(curLayer);
      idx++;
    } else if (header.value.indexOf("sub") === 0) {
      curLayer.subLayers.push({
        idx: idx,
        weight: header.weight
      });
      idx++;
    }
  }

  const totalFormula = layers
    .map(l => `${convertCellColName(l.idx)}{playerIdx}*${l.weight}`)
    .join("+");
  const roundTotalFormula = `ROUND(${totalFormula},3)`;
  const layerFormula = layers.map(l => {
    const formula = l.subLayers
      .map(sl => `${convertCellColName(sl.idx)}{playerIdx}*${sl.weight}`)
      .join("+");
    return {
      idx: l.idx,
      formula: `ROUND(${formula},3)`
    };
  });
  return {
    roundTotalFormula,
    layerFormula
  };
}

function convertToSheet(score, className, reportName, reportDate) {
  const headers = convertHeaders(score);
  const items = convertItems(score);

  const headersData = headers.map(h => h.text);
  const itemData = items
    .map(i => headers.map(h => i[h.value]))
    .map(item => {
      item.splice(1, 0, reportName, reportDate, className);
      return item;
    });

  headers.splice(
    1,
    0,
    {
      text: "报告标题",
      value: "reportTitle"
    },
    {
      text: "日期",
      value: "reportDate"
    },
    {
      text: "职业",
      value: "className"
    }
  );
  headersData.splice(1, 0, "报告标题", "日期", "职业");

  const data = [headersData].concat(itemData);

  const ws = XLSX.utils.aoa_to_sheet(data);

  const { roundTotalFormula, layerFormula } = convertFormula(headers, 5, 0);

  items.forEach((i, playerIdx) => {
    const totalCell = `B${playerIdx + 2}`;
    ws[totalCell] = {
      f: roundTotalFormula.replaceAll("{playerIdx}", playerIdx + 2)
    };
    layerFormula.forEach(l => {
      const layerCell = `${convertCellColName(l.idx)}${playerIdx + 2}`;
      ws[layerCell] = {
        f: l.formula.replaceAll("{playerIdx}", playerIdx + 2)
      };
    });
  });
  return ws;
}

export function convertHeaders(scores) {
  if (scores.length > 0) {
    const results = [
      {
        text: "名字",
        align: "start",
        sortable: false,
        value: "name"
      },
      { text: "总分", value: "totalScore" }
    ];
    return results.concat(
      ...scores[0].detailScore.map(group => {
        const groupHead = {
          text: group.displayName,
          value: `group-${group.displayName}`,
          weight: group.weight
        };
        const details = group.subGroups.map(sub => ({
          text: sub.tableName,
          value: `sub-${sub.tableName}`,
          weight: sub.weight
        }));
        return [groupHead].concat(...details);
      })
    );
  } else {
    return [];
  }
}

export function convertItems(scores) {
  return scores.map(e => {
    const summary = {
      name: e.name,
      totalScore: Math.round(e.totalScore * 100) / 100
    };
    e.detailScore.reduce((out, group) => {
      out[`group-${group.displayName}`] = Math.round(group.score * 100) / 100;
      group.subGroups.reduce((subOut, sub) => {
        subOut[`sub-${sub.tableName}`] = Math.round(sub.score * 100) / 100;
        return subOut;
      }, out);
      return out;
    }, summary);
    return summary;
  });
}
