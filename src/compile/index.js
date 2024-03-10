const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`

// 匹配到的额分组是一个 【标签名】 <xxx 匹配到的是开始 标签的名字
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 匹配的是 </xxx> 最终匹配到的分组就是结束标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 匹配属性
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// 第一个分组就是属性的key value就是 分组3/分组4/分组五 ⬆️
const startTagClose = /^\s*(\/?)>/
// 匹配到的内容就是我们表达式的变量
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

// vue3采用的并不是正则，是通过字符串来依次判断
// 对模板进行编译处理
function parseHTML(html) {
    // 最终需要转化成一颗抽象的语法树 -- 栈中的最后一个元素就是当前匹配到开始标签的父亲
    const ELEMENT_TYPE = 1
    const TEXT_TYPE = 3
    const stack = [] // 用于存放元素
    let currentParent // 指向的是栈中的最后一个
    let root  // 根结点

    function createASTElement(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }

    // 开始标签
    // 利用栈型结构来生成一棵树🌲
    function start(tag, attrs) {
        const node = createASTElement(tag, attrs) // 创造一个ast节点
        if (!root) root = node // 如果root为空则当前node是树的根节点
        if (currentParent) {
            node.parent = currentParent
            currentParent.children.push(node) // 需要让父亲记住自己
        }  // 如果currentParent有值，则当前节点的父亲为 currentParent
        stack.push(node)
        currentParent = node // currentParent为栈中的最后一个
     }
    // 文本
    function chars(text) {
        text = text.replace(/\s/g,'') // 如果空格超过2就删除2个以上
        text && currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
    }
    // 结束
    function end(tag) {
        const node = stack.pop() // 弹出足后一个
        console.log(tag, '结束标签',node) // 如果 node 和 tag 标签不一致，则可以校验标签是否合法
        currentParent = stack[stack.length - 1]
    }


    // 删除已经匹配到的标签
    function advance(n) {
        html = html.substring(n)
    }

    // 解析开始标签
    function parseStartTag() {
        const start = html.match(startTagOpen)

        if (start) {
            const match = {
                tagName: start[1], // 标签名
                attrs: []
            }
            advance(start[0].length)

            // 如果不是开始标签的结束，就一直匹配下去
            let attr, end
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] || true })
            }
            // 如果有结束标签PS： >， 则删除
            if (end) {
                advance(end[0].length)
            }

            return match
        }

        return false

    }
    while (html) {

        let textEnd = html.indexOf('<') // 若果indexof 索引是0，则说明是一个标签
        // 若果textEnd 为 0，说明是一个开始标签或者结束标签
        // 如果textEnd > 0，则说明就是文本的结束为止
        if (textEnd === 0) {
            // 开始标签的匹配结果
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName,startTagMatch.attrs)
                continue
            }
            // 匹配到结束标签，则删除
            let endTagMatch = html.match(endTag)
            if (endTagMatch) {
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
                continue
            }
        }
        if (textEnd > 0) {
            let text = html.substring(0, textEnd) // 文本内容
            if (text) {
                chars(text)
                advance(text.length) // 解析道的文本
            }

        }
    }
    console.log(root)
}

export function compileToFunction(template) {

    // 1. 就是将template 转化成ast语法树
    let ast = parseHTML(template)

    // 2. 生成render方法（render方法执行后返回的结果就是 虚拟DOM）
    return template
}