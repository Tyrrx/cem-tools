import fs from "fs";
import path from "path";
import prettier from "prettier";

export function createOutDir(outDir: string) {
  if (outDir !== "./" && !fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
}

export async function saveFile(
  outDir: string,
  fileName: string,
  contents: string,
  parser: "json" | "typescript" = "json",
  printWidth = 80
) {
  const outputPath = path.join(outDir, fileName);
  
  fs.writeFileSync(
    outputPath,
    await prettier.format(contents, { parser, printWidth })
  );

  return outputPath;
}
