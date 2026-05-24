import { parseStringPromise } from 'xml2js';

export const ParseXML = async (xml: string) => await parseStringPromise(xml.replace(/&/g, '&amp;'));
