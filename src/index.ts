import * as fs from 'fs';
import { join } from 'path';
import { XML } from './xml';

type XMLSchema = Record<string, XMLSchemaOptions>;

type XMLSchemaOptions = {
  content: string | number;
};

class WebsiteXML {
  public schema: XMLSchema = {};
  public xmlHandler: XML;
  constructor(private path: string) {
    this.xmlHandler = new XML();
  }

  public async init(schema: XMLSchema) {
    this.schema = schema;
    const isFileExist = fs.existsSync(this.path);
    if (isFileExist) {
      const xmlContent = await this.xmlHandler.parseXMLFile(this.path);
      this.schema = this.xmlBuilderToSchema(xmlContent);
      // return;
    } else {
      this.xmlHandler.writeXMLFile(this.path, this.schemaToXMLBuilder());
    }
  }
  private schemaToXMLBuilder() {
    const xmlBuilderContent: any = {};
    for (const key in this.schema) {
      xmlBuilderContent[key] = { $: { type: typeof this.schema[key].content }, _: this.schema[key].content };
    }
    return { website: xmlBuilderContent };
  }

  private xmlBuilderToSchema(xml: any) {
    if (!xml['website'] && typeof xml['website'] !== 'object') {
      console.error('ERROR: Invalid xml file!');
      process.exit(1);
    }
    const schema: XMLSchema = {};
    const websiteData = xml['website'];
    for (const key in websiteData) {
      let value: string | number = websiteData[key][0]._;
      if (websiteData[key][0].$.type === 'number') {
        value = parseInt(value as string);
      }
      schema[key] = {
        content: value,
      };
    }
    return schema;
  }

  get(key: keyof typeof this.schema) {
    return this.schema[key]?.content;
  }

  all() {
    const data: Record<string, any> = {};
    for (const k in this.schema) {
      data[k] = this.schema[k].content;
    }
    return data;
  }
}

(async () => {
  const w = new WebsiteXML(join(__dirname, '..', 't1.xml'));
  const schema = {
    AboutUs: {
      content: 'hello world',
    },
    Privace: {
      content: 10,
    },
  };
  await w.init(schema);
  console.log(schema);
  console.log(w.schema);
  console.log(w.all());
})();