import {skipSign} from '../data/skipSign';

const log = console.log;
export default function populateByTemplateString(selectedLayers, JSONobj, btnName) {
    const token = `{${btnName}}`;
    const loopSelected = async arr => {
        for (const item of arr) {
            log('Replacing', token, 'on item', item);
            if (!item.name.includes(skipSign.symbol)) {
                const tokenPosition = item.characters?.indexOf(token);

                if (item.type === 'TEXT' && tokenPosition !== -1) {
                    try {
                        if (item.fontName?.description === 'figma.mixed') {
                            const len = item.characters.length;
                            for (let i = 0; i < len; i++) {
                                const fontName = item.getRangeFontName(i, i + 1);
                                await figma.loadFontAsync(fontName);
                            }
                        } else await figma.loadFontAsync(item.fontName);
                    } catch (error) {
                        console.error('@ catch block 1', error);
                    }

                    const newToken = JSONobj[btnName].toString();
                    try {
                        item.insertCharacters(tokenPosition + token.length, newToken, 'BEFORE');
                    } catch (error) {
                        console.error('@ insertchars', error);
                    }

                    try {
                        item.deleteCharacters(tokenPosition, tokenPosition + token.length);
                    } catch (error) {
                        console.error('@ deletechars', error);
                    }
                }
                if (item.children) {
                    try {
                        await loopSelected(item.children);
                    } catch (error) {
                        console.error('@ catch block 2', error);
                    }
                }
            }
        }
    };

    loopSelected(selectedLayers);
}
