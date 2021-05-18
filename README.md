# Markdown Loader

```bash
npm install @culling/remark-loader --save-dev
```

### webpack配置

```javascript
module: {
  rules: [
    {
      test: /\.(png|jpe?g|gif|svg|bmp)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
          },
        },
      ],
    },
    {
      test: /\.md$/,
      use: [{
        loader: 'babel-loader',
      }, {
        loader: require.resolve('@culling/remark-loader'),
      }],
    }
  ]
}
```

```markdown
---
title: 标题
---

# HelloWorld
```

```typescript
interface MDModule {
  hast: any;
  front: any;
}

const module: MDModule = require('./helloworld.md');
```
console.log(module);
```json
 {
  "hast": {
    "type": "root",
    "children": [{
      "type": "element",
      "tagName": "h1",
      "properties": {},
      "children": [{
        "type": "text",
        "value": "HelloWorld"
      }]
    }]
  },
  "front": {
    "title": "标题"
  }
}
```
