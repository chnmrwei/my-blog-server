const marked = require('marked');
const hljs = require('highlight.js');

// 配置 marked
marked.setOptions({
    highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, code).value;
            } catch (err) {}
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
});

class MarkdownService {
    // 转换 Markdown 为 HTML
    static toHTML(markdown) {
        try {
            return marked(markdown);
        } catch (error) {
            console.error('Markdown 转换错误:', error);
            return markdown;
        }
    }

    // 提取文章摘要
    static getDescription(markdown, length = 200) {
        try {
            const html = marked(markdown);
            const text = html.replace(/<[^>]+>/g, '');
            return text.substring(0, length) + (text.length > length ? '...' : '');
        } catch (error) {
            console.error('摘要提取错误:', error);
            return '';
        }
    }
}

module.exports = MarkdownService; 