import * as fs from 'fs';
import * as xml2js from 'xml2js';

export class XML {
  public attributeFiled: string = '$';
  public contentKey: string = '_';
  /**
   * Write js Object to xml file
   * @param path string
   * @param data Record<string, unknown>
   */
  public writeXMLFile(path: string, data: Record<string, unknown>) {
    const builder = new xml2js.Builder({
      attrkey: this.attributeFiled,
      charkey: this.contentKey,
    });
    const xmlContent = builder.buildObject(data);
    fs.writeFileSync(path, xmlContent);
  }
  /**
   * Parse xml file to js object
   * @param path string
   */
  public async parseXMLFile(path: string) {
    const isFileExist = fs.existsSync(path);
    if (!isFileExist) {
      console.error(`ERROR: Can not find file in path ${path}`);
      process.exit(1);
    }
    const fileContent = fs.readFileSync(path, { encoding: 'utf-8' });
    const parsedData = await xml2js.parseStringPromise(fileContent, {
      attrkey: this.attributeFiled,
      charkey: this.contentKey,
    });
    return parsedData;
  }
}
