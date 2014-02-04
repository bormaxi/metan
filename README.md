metan
=====

Автоматизация отправки пользовательских событий для Google Analytics и Yandex.Metrika

## Установка
```
<script>
(function(document,window){var node=document.getElementsByTagName("script")[0],script=document.createElement("script"),ymUid=arguments[2]||null;(window["metan_callback"]=window["metan_callback"]||[]).push(function(){try{new window.Metan(ymUid)}catch(e){}});script.type="text/javascript";script.async=true;script.src=(document.location.protocol=="https:"?"https:":"http:")+"//metan.serenity.su/v1/metan.js";node.parentNode.insertBefore(script,node)})
(document,window, [yandex_metrika_id]);
</script>
```

```yandex_metrika_id```: 'string' || undefined

## Использование
```
<element data-metan-[event]="[target]" [data-metan-category="[category=undefined]"]></element>
```
## Примеры
```
<a data-metan-click="click_btn" data-metan-category="index_page" href="http://serenity.su">Click</a>
```
```
<a data-metan-click="click_btn" href="http://serenity.su">Click</a>
```