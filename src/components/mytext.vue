<template>
    <QuillEditor v-model:content="content" 
    ref="myQuillEditor"
    :options="editorOption" 
    contentType="html" 
    @update:content="onEditorChange($event)"/>
    <div class="editor_length">{{ TiLength }}/100</div>
</template>
 
<script>

// 工具栏配置
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
    ["blockquote", "code-block"], // 引用
    [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
    [{ script: "sub" }, { script: "super" }], // 上标/下标
    [{ indent: '-1' }, { indent: '+1' }], // 缩进
    [{ direction: 'rtl' }], // 文本方向
    [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
    [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
    [{ font: [] }], // 字体种类
    [{ align: [] }], // 对齐方式
    ['clean'], // 清除文本格式
    // ['link', 'image', 'video'] // 链接、图片、视频
]
import { QuillEditor, Quill } from '@vueup/vue-quill'
import { container, ImageExtend, QuillWatch } from 'quill-image-extend-module'
Quill.register('modules/ImageExtend', ImageExtend)
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
    name: "text",
    components: { QuillEditor },
    props: ['model'],
    data() {
        return {
            TiLength: 0,
            content: '',
            myQuillEditor: null,
            editorOption: {
                theme: 'snow',
                placeholder: '请输入内容',
                modules: {
                    toolbar: {
                        container: toolbarOptions,
                    }
                }
            },
        }
    },
    mounted() {
        this.myQuillEditor = this.$refs.myQuillEditor;
        this.TiLength = 0
    },
    methods: {
        onEditorChange(event) {
            let len = this.getContentLen()
            if(len > 100) {
                this.myQuillEditor.setText(this.getContent().slice(0, 100))
                return
            }
            this.TiLength = len
        },
        getContent() {
            return this.myQuillEditor.getText()
        },
        getHTML() {
            return this.myQuillEditor.getHTML()
        },
        getContentLen() {
            return this.myQuillEditor.getText().length - 1
        }
    }
}
</script>
 
<style>
.ql-container {
    height: 250px;
    min-height: 192px;
    line-height: normal;
    width: auto;
    background-color: white;
}

span.ql-size {
    max-width: 80px !important;
}


.ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: "保存";
    padding-right: 0px;
}


.ql-picker.ql-size .ql-picker-label::before,
.ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
}

.ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
    content: "10px";
}

.ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
    content: "18px";
}

.ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
    content: "32px";
}

.ql-picker.ql-header .ql-picker-label::before,
.ql-picker.ql-header .ql-picker-item::before {
    content: "文本";
}

.ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: "标题1";
}

.ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: "标题2";
}

.ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: "标题3";
}

.ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: "标题4";
}

.ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: "标题5";
}

.ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: "标题6";
}

.ql-picker.ql-font .ql-picker-label::before,
.ql-picker.ql-font .ql-picker-item::before {
    content: "标准字体";
}

.ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
    content: "衬线字体";
}

.ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
    content: "等宽字体";
}

.editor_length {
    color: #b1b3b8;
    text-align: right;
}
</style>