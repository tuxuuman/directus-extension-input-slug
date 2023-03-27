<template>
	<v-input icon="link" :model-value="value" @update:model-value="onInputChange" :type="type" :width="width">
		<template #prepend>
			<v-icon name="link" />
		</template>
	</v-input>
</template>

<script setup lang="ts">
import { inject, ref, watch, defineProps, defineEmits } from 'vue';
import slugify from '@sindresorhus/slugify';
import { useApi } from '@directus/extensions-sdk';

const props = defineProps({
	value: {
		type: String,
		default: null,
	},
	property: {
		type: String,
		default: null
	},
	options: {
		type: Object,
		default: {},
	},
	collection: {
		type: String
	},
	width: {
		type: String
	},
	type: {
		type: String
	},
	field: {
		type: String
	},
	primaryKey: {
		type: String
	},
});

const emit = defineEmits(["input"]);
const values = inject('values', ref<Record<string, any>>({}));
const defaultSlugValue = values.value.slug ?? '';
const api = useApi();

watch(values, (newValues, oldValues) => {
	if (
		!props.property ||
		newValues[props.property] === oldValues[props.property]) {
		return;
	}

	onInputChange(newValues[props.property]);
});

function debounce(fn: Function, timeout: number) {
	let timer: any = null;

	return function (...args) {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), timeout);
	}
}

const generateNewSlugIfExist = debounce(async (slug: string) => {
	if (!props.collection) {
		return;
	}

	const response = await api.get(`/items/${props.collection}?filter[${props.field}]=${slug}&fields=${props.field}`);

	if (response.data.data?.length) {
		// generate random prefix for slug
		onInputChange([
			Date.now().toString(32).slice(-5),
			Math.random().toString(32).slice(-2),
			slug
		].join(String(props.options.separator ?? '-')));
	}
}, 500);

function onInputChange(value: string) {
	const slug = slugify(value || "", props.options);

	if (props.value !== slug) {
		emit('input', slug);

		if (slug.length && slug !== defaultSlugValue) {
			generateNewSlugIfExist(slug);
		}
	}
}

</script>
