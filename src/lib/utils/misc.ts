export const htmlToText = (html: string): string => {
	return html.replace(/<[^>]*>/g, '');
};
