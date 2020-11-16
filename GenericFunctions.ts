import {
	IExecuteFunctions,
	IHookFunctions,
} from 'n8n-core';

import {
	IDataObject,
	ILoadOptionsFunctions,
} from 'n8n-workflow';

import {
	OptionsWithUri,
} from 'request';


/**
 * Make an API request to Loripsum.net
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} endpoint
 * @param {IDataObject} qs
 * @returns {Promise<any>}
 */
export async function loripsumApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: string, endpoint: string, qs: IDataObject): Promise<any> { // tslint:disable-line:no-any
  const options: OptionsWithUri = {
    method,
    qs,
    uri: `http://loripsum.net/api${endpoint}`,
    json: false,
  };

  try {
    return await this.helpers.request!(options);
  } catch (error) {

    if (error.response && error.response.body && error.response.body.error) {
      // Try to return the error prettier
      throw new Error(`Loripsum error response [${error.statusCode}]: ${error.response.body.error}`);
    }

    throw error;
  }
}


/**
 * Make an API request to Lorem Markdownum
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} endpoint
 * @param {IDataObject} qs
 * @returns {Promise<any>}
 */
export async function loremMarkdownumApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: string, endpoint: string, qs: IDataObject): Promise<any> { // tslint:disable-line:no-any
	const options: OptionsWithUri = {
		method,
    qs,
    uri: `https://jaspervdj.be/lorem-markdownum/markdown.txt${endpoint}`,
    json: false,
	};

	try {
    return await this.helpers.request!(options);
	} catch (error) {

		if (error.response && error.response.body && error.response.body.error) {
			// Try to return the error prettier
			throw new Error(`Lorem Markdownum error response [${error.statusCode}]: ${error.response.body.error}`);
		}

		throw error;
	}
}


/**
 * Compose, send and return request to relevant lorem ipsum API according to parameters
 *
 * @param {IExecuteFunctions} this
 * @returns {Promise<any>}
 */
export async function getText(this: IExecuteFunctions): Promise<string> {

  const items = this.getInputData();
  const format = this.getNodeParameter('format', 0) as IDataObject;
  var responseData;

  switch(format.toString()) {

    case 'plaintext':
      var params:string[] = [];
      params.push(this.getNodeParameter('numParas', 0).toString());
      params.push(this.getNodeParameter('paraLength', 0).toString());
      params.push('prude');
      params.push('plaintext');
      responseData = await loripsumApiRequest.call(this, 'GET', '/' + params.join('/'), '');
      break;

    case 'html':
      var params:string[] = [];
      params.push(this.getNodeParameter('numParas', 0).toString());
      params.push(this.getNodeParameter('paraLength', 0).toString());
      var paramMapping:{ [index: string]: string; } = {
        headers: 'headers',
        inlineStyling: 'decorate',
        link: 'link',
        bq: 'bq',
        code: 'code'
      }
      for(var p in paramMapping) {
        if(this.getNodeParameter(p, 0)) params.push(paramMapping[p]);
      }
      var paramMappingLinks:{ [index: string]: string; } = {
        ul: 'ul',
        ol: 'ol',
        dl: 'dl',
      }
      if(this.getNodeParameter('lists', 0)) {
        for(var p in paramMappingLinks){
          if(this.getNodeParameter(p, 0)) params.push(paramMappingLinks[p]);
        }
      }
      params.push('prude');
      responseData = await loripsumApiRequest.call(this, 'GET', '/' + params.join('/'), '');
      break;
      
    case 'markdown':
      var mdParams:{ [index: string]: any; } = {}
      mdParams['num-blocks'] = this.getNodeParameter('numParas', 0);
      if(!this.getNodeParameter('headers', 0)) {
        mdParams['no-headers'] = 'on'
      } else if(this.getNodeParameter('headerStyle', 0) == 'underlines') {
        mdParams['underline-headers'] = 'on'
      }
      if(!this.getNodeParameter('lists', 0)) {
        mdParams['no-lists'] = 'on';
      }
      if(!this.getNodeParameter('inlineStyling', 0)) {
        mdParams['no-inline-markup'] = 'on';
      }
      // NB: The 'no-external-links' param doesn't seem to do anything in the API - the 'inline-markup' param
      // controls whether links show or not
      if(this.getNodeParameter('inlineStyling', 0)) { 
        if(this.getNodeParameter('inlineEmphasis', 0) == 'underscores') {
          mdParams['underscore-em'] = 'on';
          mdParams['underscore-strong'] = 'on';
        }
        if(this.getNodeParameter('markdownLinkStyle', 0) == 'reference') {
          mdParams['reference-links'] = 'on';
        }
      }
      if(!this.getNodeParameter('bq', 0)) {
        mdParams['no-quotes'] = 'on';
      }
      if(!this.getNodeParameter('code', 0)) {
        mdParams['no-code'] = 'on'
      } else if(this.getNodeParameter('codeBlockStyle', 0) == 'backticks') {
        mdParams['fenced-code-blocks'] = 'on'
      }

      responseData = await loremMarkdownumApiRequest.call(this, 'GET', '', mdParams);
      break;
    }
  
    return responseData;

  }
