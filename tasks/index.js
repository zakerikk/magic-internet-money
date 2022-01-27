const { task } = require("hardhat/config");
const fs = require('fs')

task("AuroraOracle", "Prints the current price of AURORA tokens")
  .setAction(async taskArgs => {
    const AuroraOracle = await ethers.getContractAt("AuroraOracle", "0xDf42bA177094D3438FB193644d27A120DEEaF48F");

    console.log("latest exchange rate: ", (await AuroraOracle.get(ethers.constants.HashZero)).toString())
  });

task("CauldronV2", "check test method")
  .setAction(async taskArgs => {
    const CauldronV2 = await ethers.getContractAt("CauldronV2", "0xAad5c22eF3b10f0039A1bB623D953411299c0355");

    console.log("result: ", (await CauldronV2.withdrawFees()).toString())
  });

task("BentoBoxV1", "check test method")
  .setAction(async taskArgs => {
    const BentoBoxV1 = await ethers.getContractAt("BentoBoxV1", "0xcF9bBc99342a7704D61b2A06597aEC98D76e9155");

    console.log("result: ", (await BentoBoxV1.owner()).toString())
  });

task("MagicInternetMoney", "burn method")
  .setAction(async taskArgs => {
    const MagicInternetMoney = await ethers.getContractAt("MagicInternetMoney", "0xded1340A337bDd69aecD7e696D610E9D2F49767f");

    const result = await MagicInternetMoney.burn(0)

    console.log('await MagicInternetMoney.burn(0)', result)
  });

task("accounts", "Prints the list of accounts", require("./accounts"))

function getSortedFiles(dependenciesGraph) {
  const tsort = require("tsort");
  const graph = tsort();

  const filesMap = {};
  const resolvedFiles = dependenciesGraph.getResolvedFiles();
  resolvedFiles.forEach((f) => (filesMap[f.sourceName] = f));

  for (const [from, deps] of dependenciesGraph.entries()) {
    for (const to of deps) {
      graph.add(to.sourceName, from.sourceName);
    }
  }

  const topologicalSortedNames = graph.sort();

  // If an entry has no dependency it won't be included in the graph, so we
  // add them and then dedup the array
  const withEntries = topologicalSortedNames.concat(
    resolvedFiles.map((f) => f.sourceName)
  );

  const sortedNames = [...new Set(withEntries)];
  return sortedNames.map((n) => filesMap[n]);
}

function getFileWithoutImports(resolvedFile) {
  const IMPORT_SOLIDITY_REGEX = /^\s*import(\s+)[\s\S]*?;\s*$/gm;

  return resolvedFile.content.rawContent
    .replace(IMPORT_SOLIDITY_REGEX, "")
    .trim();
}

subtask(
  "flat:get-flattened-sources",
  "Returns all contracts and their dependencies flattened"
)
  .addOptionalParam("files", undefined, undefined, types.any)
  .addOptionalParam("output", undefined, undefined, types.string)
  .setAction(async ({ files, output }, { run }) => {
    const dependencyGraph = await run("flat:get-dependency-graph", { files });
    console.log(dependencyGraph);

    let flattened = "";

    if (dependencyGraph.getResolvedFiles().length === 0) {
      return flattened;
    }

    const sortedFiles = getSortedFiles(dependencyGraph);

    let isFirst = true;
    for (const file of sortedFiles) {
      if (!isFirst) {
        flattened += "\n";
      }
      flattened += `// File ${file.getVersionedName()}\n`;
      flattened += `${getFileWithoutImports(file)}\n`;

      isFirst = false;
    }

    // Remove every line started with "// SPDX-License-Identifier:"
    flattened = flattened.replace(
      /SPDX-License-Identifier:/gm,
      "License-Identifier:"
    );

    flattened = `// SPDX-License-Identifier: MIXED\n\n${flattened}`;

    // Remove every line started with "pragma experimental ABIEncoderV2;" except the first one
    flattened = flattened.replace(
      /pragma experimental ABIEncoderV2;\n/gm,
      (
        (i) => (m) =>
          !i++ ? m : ""
      )(0)
    );

    flattened = flattened.trim();
    if (output) {
      console.log("Writing to", output);
      fs.writeFileSync(output, flattened);
      return "";
    }
    return flattened;
  });

subtask("flat:get-dependency-graph")
  .addOptionalParam("files", undefined, undefined, types.any)
  .setAction(async ({ files }, { run }) => {
    const sourcePaths =
      files === undefined
        ? await run("compile:solidity:get-source-paths")
        : files.map((f) => fs.realpathSync(f));

    const sourceNames = await run("compile:solidity:get-source-names", {
      sourcePaths,
    });

    const dependencyGraph = await run("compile:solidity:get-dependency-graph", {
      sourceNames,
    });

    return dependencyGraph;
  });

task("flat", "Flattens and prints contracts and their dependencies")
  .addOptionalVariadicPositionalParam(
    "files",
    "The files to flatten",
    undefined,
    types.inputFile
  )
  .addOptionalParam(
    "output",
    "Specify the output file",
    undefined,
    types.string
  )
  .setAction(async ({ files, output }, { run }) => {
    console.log(
      await run("flat:get-flattened-sources", {
        files,
        output,
      })
    );
  });
