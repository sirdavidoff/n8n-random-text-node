import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';
import {
	loripsumApiRequest,
  loremMarkdownumApiRequest,
  getText,
} from './GenericFunctions';


export class RandomText implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Random Text',
		name: 'randomText',
    icon: 'file:randomtext.png',
		group: ['transform'],
		version: 1,
		description: 'Generate random plaintext, markdown or HTML (lorem ipsum-style)',
		defaults: {
			name: 'Random Text',
			color: '#772244',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
      {
        displayName: 'Format',
        name: 'format',
        type: 'options',
        options: [
          {
            name: 'Plain text',
            value: 'plaintext',
          },
          {
            name: 'HTML',
            value: 'html',
          },
          {
            name: 'Markdown',
            value: 'markdown',
          },
        ],
        default: 'plaintext',
        required: true,
        description: 'Whether you want plain text, HTML or markdown',
      },
      {
        displayName: 'Num paragraphs',
        name: 'numParas',
        type: 'number',
        typeOptions: {
          minValue: 1,
          maxValue: 15,
        },
        default: 5,
        description: 'The number of paragraphs of text to return',
      },
      {
        displayName: 'Paragraph length',
        name: 'paraLength',
        type: 'options',
        options: [
          {
            name: 'Short',
            value: 'short',
          },
          {
            name: 'Medium',
            value: 'medium',
          },
          {
            name: 'Long',
            value: 'long',
          },
          {
            name: 'Very long',
            value: 'verylong',
          },
        ],
        displayOptions: {
          show: {
            format: [
              'plaintext',
              'html'
            ],
          },
        },
        default: 'medium',
        description: 'How long the paragraphs should be',
      },
      {
        displayName: 'Headers',
        name: 'headers',
        type: 'boolean',
        default: false,
        required: true,
        description: 'Whether to include headers',
        displayOptions: {show:{format:['html', 'markdown']}},
      },
      {
        displayName: 'Headers using',
        name: 'headerStyle',
        type: 'options',
        options: [
          {
            name: 'Hashes',
            value: 'hashes',
          },
          {
            name: 'Underlines',
            value: 'underlines',
          },
        ],
        displayOptions: {show:{format:['markdown'], headers: [true]}},
        default: 'hashes',
        required: true,
        description: 'Whether the headers should be denoted by `###` or underlines',
      },
      {
        displayName: 'Lists',
        name: 'lists',
        type: 'boolean',
        default: false,
        required: true,
        description: 'Whether to include lists',
        displayOptions: {show:{format:['html', 'markdown']}},
      },
      {
        displayName: '<ul> lists',
        name: 'ul',
        type: 'boolean',
        default: false,
        required: true,
        description: 'Whether to include unordered lists',
        displayOptions: {show:{format:['html'], lists: [true]}},
      },
      {
        displayName: '<ol> lists',
        name: 'ol',
        type: 'boolean',
        default: false,
        required: true,
        description: 'Whether to include ordered lists',
        displayOptions: {show:{format:['html'], lists: [true]}},
      },
      {
        displayName: '<dl> lists',
        name: 'dl',
        type: 'boolean',
        default: false,
        required: true,
        description: 'Whether to include display lists',
        displayOptions: {show:{format:['html'], lists: [true]}},
      },
      {
        displayName: 'Inline styling',
        name: 'inlineStyling',
        type: 'boolean',
        default: false,
        required: true,
        description: 'Whether to include bold, italics, links, etc.',
        displayOptions: {show:{format:['html', 'markdown']}},
      },
      {
        displayName: 'Emphasis using',
        name: 'inlineEmphasis',
        type: 'options',
        options: [
          {
            name: 'Asterisks',
            value: 'asterisks',
          },
          {
            name: 'Underscores',
            value: 'underscores',
          },
        ],
        displayOptions: {show:{format:['markdown'], inlineStyling: [true]}},
        default: 'asterisks',
        required: true,
        description: 'Whether to use asterisks or underscores to denote bold/italic text',
      },
      {
        displayName: 'Link style',
        name: 'markdownLinkStyle',
        type: 'options',
        options: [
          {
            name: 'Inline',
            value: 'inline',
          },
          {
            name: 'Reference',
            value: 'reference',
          },
        ],
        displayOptions: {show:{format:['markdown'], inlineStyling: [true]}},
        default: 'inline',
        required: true,
        description: 'Whether to use links, and whether the URLs should be defined inline or at the end of the text',
      },
      {
        displayName: 'Links',
        name: 'link',
        type: 'boolean',
        default: false,
        required: true,
        description: 'Whether to include inline links to external websites',
        displayOptions: {show:{format:['html']}},
      },
      {
        displayName: 'Block quotes',
        name: 'bq',
        type: 'boolean',
        default: false,
        required: true,
        description: 'Whether to include blockquotes',
        displayOptions: {show:{format:['html', 'markdown']}},
      },
      {
        displayName: 'Code blocks',
        name: 'code',
        type: 'boolean',
        default: false,
        required: true,
        description: 'Whether to include code blocks',
        displayOptions: {show:{format:['html', 'markdown']}},
      },
      {
        displayName: 'Code blocks using',
        name: 'codeBlockStyle',
        type: 'options',
        options: [
          {
            name: 'Indents',
            value: 'indents',
          },
          {
            name: 'Backticks',
            value: 'backticks',
          },
        ],
        displayOptions: {show:{format:['markdown'], code: [true]}},
        default: 'indents',
        required: true,
        description: 'Whether to use intents or backticks to denote code blocks',
      },
    ]
	};


  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {

    const items = this.getInputData();
    let text: string;

    if(items.length == 0) {

      text = await getText.call(this);
      var item:INodeExecutionData = {json: {text: text}};
      return this.prepareOutputData([item]);

    } else {

      for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
        text = await getText.call(this);
        items[itemIndex].json['text'] = text;
      }
      return this.prepareOutputData(items);
    }
  }


}
