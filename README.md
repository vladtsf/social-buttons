#Социальные кнопки#
jQuery-плагин для создания кастомных социальных кнопок со счётчиком.

Можно размещать несколько кнопок на одной странице.

##Доступные сервисы##
* Facebook (Share)
* Twitter
* Вконтакте (Share)


##Примеры использования##

*JS*

    $('.like')
      .socialButton()
      .scrollToButton('hash', 1000);
    });
    
*HTML*

    <a href="?hash=1" class="like l-tw">
      <i class="l-ico"></i>
      <span class="l-count"></span>
    </a>
    
##Демо##
* Страница с футбольными событиями и кнопками для расшаривания ([перейти](http://vtsvang.github.com/social-buttons/))