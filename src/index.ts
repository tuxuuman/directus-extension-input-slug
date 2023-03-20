import { defineInterface, useCollection } from '@directus/extensions-sdk';
import InterfaceComponent from './interface.vue';

export default defineInterface({
	id: 'input-slug',
	name: 'Slug',
	icon: 'link',
	group : "standard",
	description: 'Input with auto generate slug for model properties',
	component: InterfaceComponent,
	types: ['string'],
	options: (options) => {
		const collection = options.collection ? useCollection(options.collection) : null;
		const collectionTextFileds = collection?.fields.value?.filter(f => ["string", "text"].includes(f.type)) ?? [];

		return [
			{
				field: 'property',
				name: '$t:property',
				type: "string",
				meta: {
					width: 'full',
					interface: 'select-dropdown',
					options: {
						choices: collectionTextFileds.map(f => ({
							text: f.name,
							value: f.field
						})) ?? []
					},
				},
			},
			{
				field: 'options',
				name: '$t:options',
				type: "json",
				meta: {
					width: 'full',
					interface: 'input-code',
					options: {
						template: JSON.stringify({
							separator: '-',
							lowercase: true,
							decamelize: true,
							customReplacements: [['&', ' and '], ['🦄', ' unicorn '], ['♥', ' love ']],
							preserveLeadingUnderscore: false,
							preserveTrailingDash: false,
							preserveCharacters: [],
						}, null, 4)
					}
				}
			},
		];
	},
});
