# Preguntas para el cliente — Don Ramon Jetfuel (cuestionario del nuevo sistema)

> Cómo usar este documento: se le presentan al dueño en lenguaje sencillo, sin tecnicismos.
> Las opciones de respuesta son sugerencias; su respuesta vale más que la opción. Con esto
> elegimos entre la Opción A, B o C de `plan-opciones.md`. No hace falta responder todo en
> una sentada: las secciones 1–3 son las imprescindibles.

---

## 1. Sobre tu negocio

1. ¿Qué te quita más tiempo hoy en el día a día del food truck?
   (ejemplos: cambiar precios del menú, responder mensajes de WhatsApp, publicar fotos, decidir horarios…)

2. ¿Dónde trabaja el food truck normalmente? ¿Un punto fijo, varios puntos, o eventos/festivales?
   ¿Cambia de lugar por días de la semana? (así sabemos si el horario es por día o por ubicación)

3. ¿El horario cambia a menudo? (ej.: "abrimos de 12 a 22, domingo cerrado, en fiestas abrimos tarde")
   ¿Cuántas veces al mes cambias el horario o la ubicación? (nunca / 1-2 veces / cada semana)

4. ¿Quién más te ayuda en el negocio? ¿Alguna de esas personas necesitaría también entrar al panel
   para cambiar el menú o ver los pedidos? ¿Cuántas personas serían en total: 1, 2, 3 o más?

## 2. Sobre el menú y el contenido

5. ¿Cómo cambia tu menú hoy? ¿Cuándo lo cambias y quién lo cambia por ti ahora mismo?
   (así comparamos con el panel nuevo)

6. En el menú, ¿qué quieres poder cambiar tú solo desde el panel?
   (marca todas: nombres de platos, descripciones, precios, fotos de platos, orden de los platos,
   platos "agotados del día", idiomas ES/EN, categorías)

7. ¿El menú tiene precios en dos monedas o solo en una? ¿Los precios cambian según el día o la temporada?

8. ¿Hay platos que se agotan a mitad de jornada? ¿Te gustaría marcar "agotado" con un botón
   para que la web lo muestre tachado o lo oculte? (esto es muy típico en food trucks)

9. Además del menú, ¿qué más quieres cambiar tú mismo en la web?
   (nada / horario y ubicación / fotos / avisos tipo "hoy cerrado" / todo, incluidos textos largos)

10. ¿Te gustaría escribir noticias o un blog (ej. "estaremos en el festival de San Juan") con frecuencia,
    o eso lo hacemos nosotros cuando nos lo pidas? (nunca / a veces / a menudo)

## 3. Sobre los pedidos y WhatsApp

11. Hoy, ¿cómo te llegan los pedidos? (WhatsApp directo / llamadas / nadie pide por adelantado)

12. ¿Te gustaría que la web tuviera un botón "hacer pedido" que abra WhatsApp con el pedido ya
    escrito? (sí, quiero / sí, y además quiero verlos ordenados en el panel / no)

13. Cuando recibes un pedido por WhatsApp, ¿qué te gustaría hacer con él en el panel?
    (solo apuntarlo para no olvidarlo / marcarlo como "aceptado", "listo", "entregado" /
    guardar quién pidió y su teléfono / ver una lista de pedidos del día)

14. ¿Quieres ver números del negocio? ¿Cuáles te interesan?
    (pedidos por día, platos más vendidos, cuánto se vendió en el mes…)
    ¿O con la libreta/caja actual te basta?

15. ¿Aceptas pagos por adelantado o solo en el food truck? ¿Usas algún servicio tipo PayPal,
    tarjeta, o solo efectivo? (esto decide si hay que integrar pagos — suele ser NO)

## 4. Sobre quién usa el sistema

16. Si hay 2 o más personas usando el panel: ¿todas pueden hacer todo, o prefieres que
    alguien solo "vea" y tú seas el único que edita y borra?

17. ¿Usas el panel desde el móvil principalmente? (food truck = probablemente sí; el panel
    estará pensado para usarse bien en móvil)

18. ¿Prefieres el sistema en español, en inglés, o en los dos idiomas como la web actual?

## 5. Hosting y presupuesto

19. ¿Cuánto estás dispuesto a pagar al mes por mantener el sistema (servidor + dominio)?
    (0 € y que sea lo más barato posible / hasta 5–10 € / hasta 25 € / no me importa si funciona bien)

20. ¿Ya tienes un dominio propio (p. ej. donramontje.cw)? ¿Quién lo administra hoy?
    ¿Tienes acceso a la cuenta del dominio (Namecheap, GoDaddy, Cloudflare…)?

21. ¿Cómo está alojada la web actual? (esto lo revisamos nosotros técnicamente, pero si tienes
    la factura del hosting nos ayuda a saber qué hay contratado)

22. ¿Tienes presupuesto para pagar el desarrollo inicial del panel? ¿Prefieres que sea lo más
    básico y barato posible, o algo más completo aunque cueste un poco más al inicio?

## 6. Integraciones y otras herramientas

23. ¿Usas Google Maps o Instagram para que la gente te encuentre? ¿Quieres que el panel te
    recuerde publicar (ej. aviso de horario) o eso no hace falta?

24. ¿Usas alguna otra herramienta que deba conectar con el sistema?
    (Google Calendar, hojas de cálculo de pedidos, programas de facturación, nada)

## 7. Mantenimiento y futuro

25. ¿Qué prefieres si algo se rompe o quieres un cambio? 
    (que lo arregles tú cobrando por horas / pagar una pequeña cuota mensual que incluya
    arreglos y copias de seguridad / ir viendo caso por caso)

26. ¿Cómo te imaginas el food truck dentro de un año? (más puntos de venta, pedidos online,
    franquicia, catering para eventos…) — solo para dejar espacio en el diseño desde ya.

---

## Lo que haremos con las respuestas

- Respuestas de las secciones 1–3 → decidimos **qué módulos** lleva el panel en la primera versión.
- Pregunta 10 → si quiere blog/autoedición total, activamos la **Opción A** (añadir WordPress);
  si no, **Opción B** (mantener web estática + panel), que es la recomendada.
- Preguntas 19–22 → confirmamos **presupuesto** (hosting Hetzner ~5 €/mes es lo más probable).
- Pregunta 14 → añadimos o quitamos **estadísticas** de la primera versión.
