/**
 * Base de conocimiento del chatbot de Isla Chiquita.
 *
 * Fuente: documento oficial de Preguntas Frecuentes del hotel (FAQ.docx).
 * Cada entrada conserva la información OFICIAL; el chatbot la reformula con su
 * tono cálido pero NUNCA inventa datos fuera de aquí.
 *
 * Este archivo cumple dos funciones:
 *  1. Es el "seed" que se carga a Supabase (scripts/seed.mjs).
 *  2. Sirve de respaldo local: si Supabase aún no está configurado, el backend
 *     usa estos mismos datos para que el chat funcione igual.
 *
 * `ref` = número original de la pregunta en el documento (trazabilidad).
 */

export type FaqCategory =
  | 'llegar'
  | 'parqueo'
  | 'alojamiento'
  | 'gastronomia'
  | 'bioluminiscencia'
  | 'tours'
  | 'pase-dia'
  | 'precios-pagos'
  | 'politicas'
  | 'amenidades'
  | 'ocasiones'
  | 'accesibilidad'
  | 'reservas'
  | 'general'

export interface Faq {
  ref: number
  category: FaqCategory
  question: string
  answer: string
  keywords: string[]
}

/** Etiquetas legibles de cada categoría (para agrupar en el prompt y en el panel). */
export const CATEGORY_LABELS: Record<FaqCategory, string> = {
  llegar: 'Cómo llegar y transporte',
  parqueo: 'Parqueo',
  alojamiento: 'Alojamiento y habitaciones',
  gastronomia: 'Gastronomía y restaurante',
  bioluminiscencia: 'Bioluminiscencia',
  tours: 'Tours y actividades',
  'pase-dia': 'Pase del día',
  'precios-pagos': 'Precios y pagos',
  politicas: 'Políticas del hotel',
  amenidades: 'Amenidades y servicios',
  ocasiones: 'Ocasiones especiales',
  accesibilidad: 'Accesibilidad',
  reservas: 'Reservas y disponibilidad',
  general: 'Información general',
}

export const FAQS: Faq[] = [
  {
    ref: 1,
    category: 'politicas',
    question: '¿El hotel acepta niños?',
    answer: 'Sí, recibimos niños de todas las edades.',
    keywords: ['niños', 'infantes', 'familias', 'edades'],
  },
  {
    ref: 2,
    category: 'llegar',
    question: '¿Cómo se llega hasta el hotel?',
    answer:
      'Formas de llegar:\n' +
      'Opción 1: Llegar a Puntarenas, dejar el carro en un parqueo público de su preferencia y cruzar el ferry a Paquera a pie. Les esperamos a la salida del ferry (atracadero); nuestros compañeros usan uniforme del hotel y a la derecha del ferry hay una rampa que los lleva hasta el bote del hotel.\n' +
      'Opción 2: Cruzar el carro en el ferry; les esperamos al otro lado en nuestro parqueo gratuito en Punta Cuchillos, a 10 minutos del ferry. Al salir del ferry, en los siguientes 75 metros está la primera salida a mano izquierda que lleva al parqueo, frente al mar, donde el bote les recoge.\n' +
      'Opción 3: Servicio de bote privado desde el Ocean Marina en Puntarenas hasta el hotel (~20 minutos). El precio depende de la cantidad de personas.\n' +
      'Opción 4: Por tierra, si viene desde Guanacaste, Paquera, Santa Teresa, Montezuma o cualquier lugar de esa zona, NO necesita ferry. El punto de encuentro es el parqueo en Punta Cuchillos, Paquera (a 10 minutos del atracadero del ferry).',
    keywords: ['llegar', 'cómo llegar', 'ferry', 'bote', 'puntarenas', 'paquera', 'ruta', 'traslado'],
  },
  {
    ref: 3,
    category: 'amenidades',
    question: '¿El hotel tiene piscina?',
    answer: 'Sí, tenemos piscina pequeña para adultos y niños.',
    keywords: ['piscina', 'pool', 'nadar'],
  },
  {
    ref: 4,
    category: 'llegar',
    question: '¿Cuánto tarda el bote desde Paquera/ferry hasta el hotel?',
    answer: 'Tarda solo 5 minutos.',
    keywords: ['bote', 'tiempo', 'paquera', 'duración', 'ferry'],
  },
  {
    ref: 5,
    category: 'bioluminiscencia',
    question: '¿La bioluminiscencia se ve todo el año?',
    answer:
      'Se ve todo el año, excepto durante la luna llena, ya que es un tour que se aprecia en noches oscuras. Se sugiere evitar los días de luna llena, 2 días antes y 2 días después, para poder ver el fenómeno.',
    keywords: ['bioluminiscencia', 'todo el año', 'luna', 'temporada'],
  },
  {
    ref: 6,
    category: 'bioluminiscencia',
    question: '¿La bioluminiscencia es en kayak o en bote?',
    answer: 'El tour se realiza en bote, más que todo por seguridad para las familias con niños pequeños.',
    keywords: ['bioluminiscencia', 'kayak', 'bote'],
  },
  {
    ref: 7,
    category: 'bioluminiscencia',
    question: '¿La bioluminiscencia se ve desde el hotel o hay que salir a los alrededores?',
    answer:
      'No se ve en los alrededores de la playa por la luz del hotel. Es necesario tomar el tour para vivir la experiencia.',
    keywords: ['bioluminiscencia', 'hotel', 'ver', 'tour'],
  },
  {
    ref: 8,
    category: 'bioluminiscencia',
    question: '¿Se puede nadar durante el tour de bioluminiscencia?',
    answer: 'No se puede nadar durante el tour por un tema de seguridad.',
    keywords: ['bioluminiscencia', 'nadar', 'seguridad'],
  },
  {
    ref: 9,
    category: 'alojamiento',
    question: '¿Todas las habitaciones tienen aire acondicionado?',
    answer:
      'No todas; algunas tienen solo abanico. Puede revisar el detalle en el sitio web: https://www.islachiquitacostarica.com/es',
    keywords: ['aire acondicionado', 'a/c', 'abanico', 'habitaciones'],
  },
  {
    ref: 10,
    category: 'politicas',
    question: '¿El hotel acepta mascotas?',
    answer:
      'No, el hotel no acepta mascotas. Sabemos que son seres muy queridos y miembros de la familia, pero por la geografía de la isla, las tiendas de lona y el traslado en bote no son aptos para mascotas.',
    keywords: ['mascotas', 'perros', 'gatos', 'pet'],
  },
  {
    ref: 11,
    category: 'politicas',
    question: '¿Hay mínimo de noches para hospedarse?',
    answer:
      'En temporada de Navidad, fin y principio de año, el mínimo es de 3 noches. El resto del año no hay mínimo, pero se recomiendan al menos 2 noches para vivir toda la experiencia de quedarse en una isla.',
    keywords: ['mínimo', 'noches', 'estadía', 'navidad'],
  },
  {
    ref: 12,
    category: 'tours',
    question: '¿Qué actividades ofrece el hotel?',
    answer:
      'Puede ver toda la información de las actividades en: https://www.islachiquitacostarica.com/es/experiencias',
    keywords: ['actividades', 'experiencias', 'tours'],
  },
  {
    ref: 13,
    category: 'gastronomia',
    question: '¿En el hotel hay restaurante?',
    answer:
      'Sí, tenemos el Restaurante Tía Nora y el icónico Harry’s Bar, con una increíble vista y servicio.',
    keywords: ['restaurante', 'tía nora', 'harrys bar', 'comida'],
  },
  {
    ref: 14,
    category: 'gastronomia',
    question: '¿Se puede llegar solo a almorzar?',
    answer:
      'Con reserva previa se puede llegar solo a desayunar, almorzar o cenar. Más información: https://www.islachiquitacostarica.com/es/gastronomia',
    keywords: ['almorzar', 'almuerzo', 'solo comer', 'desayuno', 'cena'],
  },
  {
    ref: 15,
    category: 'tours',
    question: '¿Se puede llegar solo a hacer un tour?',
    answer:
      'Con reserva previa se puede llegar a hacer solo el tour, aunque recomendamos quedarse al menos una noche.',
    keywords: ['tour', 'solo tour', 'día'],
  },
  {
    ref: 16,
    category: 'accesibilidad',
    question: '¿Hay accesibilidad para sillas de ruedas?',
    answer:
      'Tenemos una habitación con accesibilidad que cumple la ley 7600; sin embargo, la geografía de la isla en sí misma no es idónea para traslados en silla de ruedas.',
    keywords: ['silla de ruedas', 'accesibilidad', 'discapacidad', 'ley 7600'],
  },
  {
    ref: 17,
    category: 'politicas',
    question: '¿Puedo llevar cosas de comer y beber?',
    answer:
      'No. Por eso ofrecemos servicio de alimentación completa y una amplia carta de bebidas a su disposición.',
    keywords: ['comida', 'bebida', 'traer', 'externo'],
  },
  {
    ref: 18,
    category: 'amenidades',
    question: '¿Hay boyas para alquilar para mi bote?',
    answer:
      'Sí. Los precios del alquiler varían según sean por horas o por día. Puede consultar en la recepción del hotel: +506 8797 4711.',
    keywords: ['boyas', 'alquiler', 'bote propio', 'yate'],
  },
  {
    ref: 19,
    category: 'gastronomia',
    question: '¿Se deben reservar los almuerzos y cenas?',
    answer: 'Sí, se deben reservar los espacios con la recepción del hotel una vez en la isla.',
    keywords: ['reservar', 'almuerzo', 'cena', 'restaurante'],
  },
  {
    ref: 20,
    category: 'pase-dia',
    question: '¿Se puede ir solo a pasar el día?',
    answer: 'Sí, tenemos la opción de Pase del Día.',
    keywords: ['pase del día', 'day pass', 'un día'],
  },
  {
    ref: 21,
    category: 'pase-dia',
    question: '¿Cuánto vale el Pase del Día y qué incluye?',
    answer:
      'Pase del Día: $70 por adulto (12 años en adelante) y $40 por niño (6 a 11 años).\n' +
      'Incluye: almuerzo a la carta de tres tiempos con 1 bebida natural o cerveza nacional (no incluye plato premium ni otras bebidas alcohólicas); uso de piscina (no hay vestidores con duchas, únicamente ducha externa); uso de kayaks; traslado ida y vuelta desde Punta Cuchillos o el muelle del ferry en Paquera; e impuestos.\n' +
      'Políticas: visitas válidas de 8:00 a. m. a 5:00 p. m., sujeto a espacio. Se solicita pago total al reservar. Las cancelaciones se realizan solo por escrito a direcciones electrónicas del hotel. Se provee 1 toalla de playa por persona (daño o pérdida: $35 + IVA por toalla). No se permite ingreso de bebidas o alimentos. No se aceptan mascotas. Por ley 9028/10066 no se permite fumar/vapear en restaurante, piscina ni áreas comunes. Cancelaciones con menos de 48 horas de antelación se penalizan por el monto total (no reembolsable). El no presentarse aplica 100% de penalidad (no reembolsable). El hotel cuenta con 2 duchas externas.',
    keywords: ['pase del día', 'precio', 'incluye', 'day pass', 'costo'],
  },
  {
    ref: 22,
    category: 'bioluminiscencia',
    question: '¿Cuánto vale el tour de bioluminiscencia?',
    answer:
      'El tour de bioluminiscencia cuesta $35.00 por adulto y $17.00 por niño (3 a 11 años). Se suma el 13% de impuestos no incluido.',
    keywords: ['bioluminiscencia', 'precio', 'costo', 'tour'],
  },
  {
    ref: 23,
    category: 'tours',
    question: '¿En qué fechas hay tour de ballenas?',
    answer: 'Las ballenas se ven en los meses de agosto, setiembre y octubre de cada año en esta zona.',
    keywords: ['ballenas', 'avistamiento', 'temporada', 'fechas'],
  },
  {
    ref: 24,
    category: 'reservas',
    question: '¿Con cuánto tiempo antes debo reservar?',
    answer:
      'Puede reservar en cualquier momento mientras haya espacio; sin embargo, sugerimos reservar con bastante anticipación para no perder disponibilidad, ya que nos llenamos muy rápido.',
    keywords: ['reservar', 'anticipación', 'cuándo', 'disponibilidad'],
  },
  {
    ref: 26,
    category: 'amenidades',
    question: '¿Se deben llevar toallas o el hotel las brinda?',
    answer: 'El hotel tiene toallas para baño y para uso de la piscina; no debe llevarlas.',
    keywords: ['toallas', 'llevar', 'piscina'],
  },
  {
    ref: 27,
    category: 'llegar',
    question: '¿Ofrecen servicio de transporte desde el aeropuerto?',
    answer:
      'Sí, ofrecemos transporte privado desde los aeropuertos internacionales (SJO/LIR) y locales (ACO, TMU), públicos o privados. Los costos varían según las rutas y la cantidad de personas.',
    keywords: ['transporte', 'aeropuerto', 'sjo', 'lir', 'traslado privado'],
  },
  {
    ref: 28,
    category: 'tours',
    question: '¿Cuál es la edad mínima para niños en los tours?',
    answer:
      'En la mayoría de los tours pueden ir niños incluso en brazos. Para tours un poco más extremos, como el snorkeling, la edad mínima es de 6 años.',
    keywords: ['edad mínima', 'niños', 'tours', 'snorkeling'],
  },
  {
    ref: 29,
    category: 'alojamiento',
    question: '¿Las habitaciones tienen cocina?',
    answer:
      'No, esa es una de las razones por las que tenemos servicio de restaurante. La única habitación que ofrece cocina equipada es la Casita A/C Vista al Mar.',
    keywords: ['cocina', 'habitaciones', 'casita'],
  },
  {
    ref: 30,
    category: 'ocasiones',
    question: '¿Tienen paquetes de luna de miel?',
    answer:
      'Sí, tenemos paquetes para luna de miel. Puede consultar disponibilidad y precios en: https://www.islachiquitacostarica.com/es/ofertas-especiales',
    keywords: ['luna de miel', 'honeymoon', 'paquetes', 'romántico'],
  },
  {
    ref: 31,
    category: 'parqueo',
    question: '¿El hotel tiene parqueo?',
    answer: 'Sí, tenemos parqueo privado, gratuito y seguro en Punta Cuchillos, Paquera.',
    keywords: ['parqueo', 'estacionamiento', 'punta cuchillos'],
  },
  {
    ref: 32,
    category: 'parqueo',
    question: '¿El parqueo del hotel tiene costo?',
    answer: 'El parqueo del hotel, ubicado en Punta Cuchillos, es gratuito para nuestros huéspedes.',
    keywords: ['parqueo', 'costo', 'gratuito'],
  },
  {
    ref: 33,
    category: 'parqueo',
    question: '¿El parqueo del hotel es seguro?',
    answer:
      'Sí, el parqueo del hotel en Punta Cuchillos es seguro: cuenta con cámaras de vigilancia y guarda nocturno.',
    keywords: ['parqueo', 'seguro', 'vigilancia', 'cámaras'],
  },
  {
    ref: 34,
    category: 'amenidades',
    question: '¿El hotel tiene deck de yoga?',
    answer:
      'Sí, el hotel tiene un deck de yoga con una increíble vista, a su disposición para su relajación personal. Para grupos, podemos cotizar.',
    keywords: ['yoga', 'deck', 'bienestar'],
  },
  {
    ref: 35,
    category: 'gastronomia',
    question: '¿Me pueden pasar el menú del restaurante?',
    answer:
      'Con mucho gusto. Puede ver los menús actualizados aquí: https://www.islachiquitacostarica.com/eat-drink',
    keywords: ['menú', 'carta', 'restaurante', 'comida'],
  },
  {
    ref: 36,
    category: 'alojamiento',
    question: '¿Las habitaciones tienen piscina privada?',
    answer:
      'No todas. Con piscina privada tenemos: la Family Tent, las Suite Premium, la Master Sunset Suite y la Casita.',
    keywords: ['piscina privada', 'plunge', 'habitaciones', 'suite'],
  },
  {
    ref: 37,
    category: 'politicas',
    question: '¿El lugar es apto para niños y personas mayores?',
    answer:
      'Sí, es apto. Sin embargo, es importante reportar cualquier problema de movilidad o requerimiento especial para atenderle de la mejor manera posible.',
    keywords: ['apto', 'niños', 'adultos mayores', 'movilidad'],
  },
  {
    ref: 38,
    category: 'amenidades',
    question: '¿Se puede nadar en la playa?',
    answer:
      'Sí. Al ser un golfo, es de muy poco oleaje, de manera que se presta especialmente para andar en kayak y en tablas de remo.',
    keywords: ['playa', 'nadar', 'oleaje', 'golfo'],
  },
  {
    ref: 39,
    category: 'amenidades',
    question: '¿Se necesita reservar los kayaks y tablas de remo con anticipación?',
    answer:
      'No. Al ser una amenidad incluida en el hospedaje, no requiere reserva previa. Están disponibles en el kiosko cerca de la playa.',
    keywords: ['kayak', 'tablas de remo', 'sup', 'paddle', 'reserva'],
  },
  {
    ref: 40,
    category: 'bioluminiscencia',
    question: '¿A qué hora se hace el tour de bioluminiscencia?',
    answer:
      'Hay 3 turnos: 6:30 p. m., 7:30 p. m. y 8:30 p. m. La hora final se confirma al momento del check-in, pero es importante reservar su cupo con antelación.',
    keywords: ['bioluminiscencia', 'hora', 'turnos', 'horario'],
  },
  {
    ref: 41,
    category: 'gastronomia',
    question: '¿El hotel puede ajustar el menú a mis alergias y necesidades alimentarias?',
    answer:
      'Sí, podemos adaptar los menús e ingredientes a sus necesidades. Déjenos saber de antemano sus alergias y restricciones alimentarias para brindarle un mejor servicio.',
    keywords: ['alergias', 'restricciones', 'dieta', 'menú', 'vegetariano', 'vegano'],
  },
  {
    ref: 42,
    category: 'general',
    question: '¿Cuál es la mejor época para ir al hotel?',
    answer:
      '¡Cualquier época es buena! Hay quienes prefieren el verano para hacer snorkeling y quienes prefieren el invierno para ver las ballenas. ¡Cada época tiene su encanto!',
    keywords: ['mejor época', 'temporada', 'cuándo ir'],
  },
  {
    ref: 43,
    category: 'precios-pagos',
    question: '¿Tienen tarifas especiales para nacionales?',
    answer:
      'Sí, contamos con tarifas especiales para nacionales. Puede verlas en: https://www.islachiquitacostarica.com/es/ofertas-especiales',
    keywords: ['tarifas', 'nacionales', 'residentes', 'descuento', 'pura isla'],
  },
  {
    ref: 44,
    category: 'alojamiento',
    question: '¿Todas las habitaciones tienen barandas?',
    answer: 'Sí, todas las tiendas cuentan con baranda.',
    keywords: ['barandas', 'seguridad', 'tiendas'],
  },
  {
    ref: 45,
    category: 'ocasiones',
    question: '¿El hotel ofrece cortesías o decoración para cumpleaños u ocasiones especiales?',
    answer:
      'Ofrecemos decoración especial y paquetes para festejar ese día, con varias opciones para personalizar la celebración.',
    keywords: ['cumpleaños', 'decoración', 'celebración', 'aniversario', 'ocasión especial'],
  },
  {
    ref: 46,
    category: 'alojamiento',
    question: '¿Tienen fotos de las habitaciones?',
    answer: 'Las fotos del hotel pueden verse en: https://www.islachiquitacostarica.com/es',
    keywords: ['fotos', 'habitaciones', 'imágenes', 'galería'],
  },
  {
    ref: 47,
    category: 'precios-pagos',
    question: '¿Qué es el Conservation Fee?',
    answer:
      'Es un cargo fijo en el hospedaje. Como parte de nuestro compromiso con una vida más sostenible, introdujimos un Fee de Conservación de $15 por persona a partir de los 12 años (por estadía). Contribuye a nuestros esfuerzos de neutralidad de carbono, al programa de propagación de manglares, al programa Ocean Hero (limpieza de playas), a Bandera Azul y a la divulgación comunitaria.',
    keywords: ['conservation fee', 'conservación', 'cargo', 'sostenibilidad', '15'],
  },
  {
    ref: 48,
    category: 'parqueo',
    question: '¿Cuál es la dirección del parqueo del hotel?',
    answer:
      'Nuestro parqueo privado está en Punta Cuchillos, Paquera.\n' +
      'Google Maps: https://maps.app.goo.gl/Snnib8ooGtsTnVXT6\n' +
      'Waze: https://waze.com/ul/hd1exunn4z',
    keywords: ['dirección', 'parqueo', 'ubicación', 'mapa', 'waze', 'punta cuchillos'],
  },
  {
    ref: 49,
    category: 'llegar',
    question: '¿El bote de Paquera a la isla tiene costo?',
    answer:
      'Para el check-in y el check-out, el traslado en bote desde y hacia Paquera está incluido. Para traslados adicionales hay un costo de $5.66 por persona, por vía.',
    keywords: ['bote', 'costo', 'paquera', 'traslado', 'incluido'],
  },
  {
    ref: 50,
    category: 'llegar',
    question: '¿Tienen chalecos de seguridad en los botes?',
    answer:
      'Sí, tenemos chalecos de seguridad para adultos y niños en los botes, y son de uso obligatorio.',
    keywords: ['chalecos', 'seguridad', 'botes', 'salvavidas'],
  },
  {
    ref: 51,
    category: 'llegar',
    question: '¿Cuál es el horario de los botes para entrar y salir de la isla?',
    answer:
      'Taxi acuático del hotel para check-in / entrada: 10:30 a. m., 11:30 a. m., 1:30 p. m., 2:45 p. m. y 4:45 p. m.\n' +
      'Taxi acuático del hotel para check-out / salida: 8:00 a. m., 9:00 a. m., 10:15 a. m., 11:15 a. m., 1:15 p. m., 2:00 p. m. y 5:00 p. m.\n' +
      'El bote sale del muelle del ferry de Paquera o desde nuestro parqueo en Punta Cuchillos. (Horarios sujetos a cambio; conviene coordinarlos con el hotel.)',
    keywords: ['horario', 'botes', 'taxi acuático', 'entrada', 'salida', 'check-in', 'check-out'],
  },
  {
    ref: 52,
    category: 'llegar',
    question: '¿Es estrictamente necesario tomar el ferry para llegar al hotel?',
    answer:
      'No. Puede usar nuestro servicio de bote privado desde el Ocean Marina. Si viene desde Cóbano, Montezuma, Santa Teresa o el Pacífico Norte (Guanacaste, Liberia, Limonal, toda esa zona), debe llegar a nuestro estacionamiento en Punta Cuchillos y NO tomar ferry. También puede volar al aeropuerto de Cóbano, que está a 40 minutos.',
    keywords: ['ferry', 'necesario', 'bote privado', 'cóbano', 'guanacaste'],
  },
  {
    ref: 53,
    category: 'general',
    question: '¿Hay restaurantes cercanos?',
    answer:
      'Hay otras opciones en la zona, pero se requiere contratar el servicio de bote para salir de la isla.',
    keywords: ['restaurantes cercanos', 'afuera', 'zona'],
  },
  {
    ref: 54,
    category: 'general',
    question: '¿Hay farmacias y supermercados cercanos?',
    answer:
      'Las farmacias, supermercados y gasolineras cercanos están en Paquera, a 20 minutos conduciendo desde el hotel.',
    keywords: ['farmacia', 'supermercado', 'gasolinera', 'paquera', 'cercano'],
  },
  {
    ref: 55,
    category: 'amenidades',
    question: '¿El hotel tiene tienda de souvenirs?',
    answer:
      'Tenemos a la venta un pequeño surtido de artículos que normalmente encuentra en una tienda de souvenirs, así como artículos o medicamentos de primera necesidad.',
    keywords: ['souvenir', 'tienda', 'recuerdos', 'artículos'],
  },
  {
    ref: 56,
    category: 'politicas',
    question: '¿Puedo llegar temprano al hotel?',
    answer:
      'El check-in es a las 2:00 p. m., pero puede llegar a partir de las 8:00 a. m. y usar las instalaciones mientras la habitación está lista. Guardamos con gusto su equipaje en la recepción.',
    keywords: ['temprano', 'check-in', 'llegar', 'equipaje', 'horario'],
  },
  {
    ref: 57,
    category: 'politicas',
    question: '¿Se puede acampar en el hotel?',
    answer: 'No, no ofrecemos la opción de acampar en la isla.',
    keywords: ['acampar', 'camping', 'carpa propia'],
  },
  {
    ref: 58,
    category: 'ocasiones',
    question: '¿El hotel organiza bodas?',
    answer:
      'Sí, con mucho gusto organizamos cada detalle para ese día tan especial, incluso el hospedaje de todos sus invitados. Puede escribir para una cotización a nuestra encargada de bodas: ingrid@islachiquita.com',
    keywords: ['bodas', 'matrimonio', 'evento', 'ingrid', 'cotización'],
  },
  {
    ref: 59,
    category: 'gastronomia',
    question: '¿Cuál es el horario del restaurante?',
    answer:
      'Horario del restaurante: desayunos de 7:00 a. m. a 9:30 a. m.; almuerzos de 12:00 m. d. a 3:00 p. m.; cena de 6:00 p. m. a 8:00 p. m.',
    keywords: ['horario', 'restaurante', 'desayuno', 'almuerzo', 'cena'],
  },
  {
    ref: 60,
    category: 'llegar',
    question: '¿El hotel ofrece servicio de bote privado desde Puntarenas?',
    answer:
      'Sí, ofrecemos un servicio rápido y confortable de traslado en bote privado desde el Ocean Marina en Puntarenas. El precio varía según la cantidad de personas.',
    keywords: ['bote privado', 'puntarenas', 'ocean marina', 'traslado'],
  },
  {
    ref: 62,
    category: 'gastronomia',
    question: '¿Qué es la pensión completa / full board?',
    answer:
      'La pensión completa son los 3 tiempos de alimentación incluidos. Contempla entrada, plato fuerte, postre y bebida natural o gaseosa.',
    keywords: ['pensión completa', 'full board', 'comidas incluidas', 'alimentación'],
  },
  {
    ref: 63,
    category: 'precios-pagos',
    question: '¿Cuáles son los medios de pago que aceptan?',
    answer: 'Aceptamos tarjetas de crédito y débito, efectivo (in situ) y transferencias o depósitos bancarios.',
    keywords: ['pago', 'medios de pago', 'tarjeta', 'efectivo', 'transferencia'],
  },
  {
    ref: 64,
    category: 'amenidades',
    question: '¿El hotel cuenta con servicio de internet para teletrabajar?',
    answer:
      'Sí, tenemos servicio de internet que le permite teletrabajar desde la habitación o las áreas comunes.',
    keywords: ['internet', 'wifi', 'teletrabajo', 'trabajo remoto'],
  },
  {
    ref: 65,
    category: 'politicas',
    question: '¿Qué es lo más tarde que puedo llegar al hotel?',
    answer: 'Recomendamos no llegar después de las 6:00 p. m.',
    keywords: ['tarde', 'llegar', 'hora límite', 'noche'],
  },
  {
    ref: 66,
    category: 'gastronomia',
    question: '¿Hay servicio de restaurante o entrega de comidas a la habitación?',
    answer:
      'No, no brindamos servicio de comidas con entrega en la habitación; solo servimos en el restaurante.',
    keywords: ['room service', 'habitación', 'entrega', 'comida'],
  },
  {
    ref: 67,
    category: 'amenidades',
    question: '¿Ofrecen servicio de lavandería? ¿Cuál es el costo?',
    answer:
      'Sí, bajo solicitud previa para coordinarlo con lavandería. El costo es de $10.00 por bolsa. La bolsa para lavandería debe solicitarse en la recepción del hotel.',
    keywords: ['lavandería', 'lavado', 'ropa', 'costo'],
  },
  {
    ref: 68,
    category: 'amenidades',
    question: '¿Hay servicio de niñera?',
    answer: 'No, no ofrecemos servicio de niñera.',
    keywords: ['niñera', 'babysitter', 'cuido de niños'],
  },
  {
    ref: 69,
    category: 'amenidades',
    question: '¿En el hotel hay cunas?',
    answer: 'Sí, tenemos encierros para bebé disponibles bajo solicitud, sin costo adicional.',
    keywords: ['cunas', 'bebé', 'corral', 'encierro'],
  },
  {
    ref: 70,
    category: 'amenidades',
    question: '¿Ofrecen servicio de spa?',
    answer:
      'Sí, ofrecemos servicios de spa. Es importante reservar con anticipación para garantizar su cita. Durante la temporada de mayo a noviembre, el spa está disponible únicamente los fines de semana.',
    keywords: ['spa', 'masaje', 'bienestar', 'nimbú'],
  },
  {
    ref: 71,
    category: 'llegar',
    question: '¿El hotel tiene helipuerto?',
    answer:
      'Sí, tenemos una zona que funciona como helipuerto privado. Es importante coordinar su llegada si utiliza helicóptero.',
    keywords: ['helipuerto', 'helicóptero', 'llegada'],
  },
  {
    ref: 73,
    category: 'amenidades',
    question: '¿Hay duchas y vestidores en áreas comunes?',
    answer:
      'En áreas comunes tenemos 2 duchas al aire libre. No tenemos vestidores, pero hay baños en las áreas comunes que puede usar para cambiarse.',
    keywords: ['duchas', 'vestidores', 'áreas comunes', 'baños'],
  },
  {
    ref: 74,
    category: 'alojamiento',
    question: '¿Las habitaciones son tiendas o habitaciones regulares?',
    answer:
      'Son tiendas de acampar de lujo. ¡Llevamos el camping a otro nivel, con todas las comodidades que ofrecería un hotel con habitación regular!',
    keywords: ['tiendas', 'glamping', 'habitaciones', 'carpas', 'lujo'],
  },
  {
    ref: 75,
    category: 'general',
    question: '¿Cómo está el clima en estos días?',
    answer:
      'El clima de la isla es tropical y cálido la mayor parte del año. Para el pronóstico exacto de sus fechas, con gusto se lo consultamos o puede revisarlo antes de su visita. (El chatbot puede integrarse con un servicio de clima en vivo para dar el dato del día.)',
    keywords: ['clima', 'tiempo', 'pronóstico', 'temperatura', 'lluvia'],
  },
  {
    ref: 76,
    category: 'reservas',
    question: '¿Dónde puedo ver disponibilidad para reservar?',
    answer:
      'Puede ver disponibilidad y reservar su habitación aquí: https://www.islachiquitacostarica.com/book/accommodations',
    keywords: ['disponibilidad', 'reservar', 'reserva', 'fechas', 'booking'],
  },
  {
    ref: 77,
    category: 'bioluminiscencia',
    question: '¿Puedo ir a ver la bioluminiscencia en kayak por mi propia cuenta?',
    answer:
      'No. Para acceder a la zona donde se aprecia la bioluminiscencia, y por seguridad, debe ser un tour guiado. Además, el tour se realiza en bote.',
    keywords: ['bioluminiscencia', 'kayak', 'solo', 'por mi cuenta', 'guiado'],
  },
  {
    ref: 78,
    category: 'tours',
    question: '¿En el hotel hay senderos para caminar?',
    answer:
      'Sí, el sendero Simbiosis le espera con una caminata de 1 kilómetro a 40 metros de altitud, con nivel de dificultad 2 y las mejores vistas de la isla.',
    keywords: ['senderos', 'caminar', 'simbiosis', 'hiking', 'naturaleza'],
  },
  {
    ref: 79,
    category: 'general',
    question: '¿Se puede ir solo a la isla?',
    answer:
      'Nuestro hotel es apto para personas que viajan solas, en familia o con grupos de amistades o compañeros de trabajo.',
    keywords: ['solo', 'viajar solo', 'individual', 'grupos'],
  },
  {
    ref: 80,
    category: 'tours',
    question: '¿Ofrecen paseos en bote?',
    answer:
      'Sí, tenemos varias opciones disponibles. Puede ver la oferta completa en: https://www.islachiquitacostarica.com/es/experiencias',
    keywords: ['paseos', 'bote', 'tours', 'navegación'],
  },
  {
    ref: 81,
    category: 'llegar',
    question: '¿Cuáles son los horarios del ferry?',
    answer:
      'Puede consultar los horarios del ferry e incluso reservar sus tiquetes en la página de la Naviera Tambor: https://navieratambor.com/horarios-y-tarifas',
    keywords: ['ferry', 'horarios', 'naviera tambor', 'tiquetes'],
  },
  {
    ref: 82,
    category: 'llegar',
    question: '¿Cuál es el ferry que hay que tomar?',
    answer:
      'El ferry que debe tomar para llegar cerca del hotel es el ferry a Paquera, en la Naviera Tambor, Puntarenas.',
    keywords: ['ferry', 'paquera', 'cuál', 'naviera tambor'],
  },
  {
    ref: 83,
    category: 'llegar',
    question: '¿Se puede llegar en carro hasta el hotel?',
    answer:
      'No. Al ser una isla, obligatoriamente se debe tomar un bote para ingresar. Desde Paquera, el bote tarda solo 5 minutos.',
    keywords: ['carro', 'auto', 'llegar', 'isla', 'bote'],
  },
  {
    ref: 84,
    category: 'reservas',
    question: '¿Debo reservar las actividades con anticipación?',
    answer:
      'Sí, recomendamos reservar sus actividades con anticipación para garantizar sus cupos. ¡Son experiencias que no se querrá perder!',
    keywords: ['reservar', 'actividades', 'anticipación', 'tours', 'cupos'],
  },
  {
    ref: 85,
    category: 'amenidades',
    question: '¿Se puede andar en bicicleta en el hotel?',
    answer:
      'No. La geografía de la isla y la dificultad para trasladar la bicicleta en bote hasta la isla no la hacen apta para este medio de transporte.',
    keywords: ['bicicleta', 'bici', 'transporte'],
  },
  {
    ref: 86,
    category: 'llegar',
    question: '¿Puedo pedir el bote para salir de la isla en cualquier momento? ¿Tiene costo?',
    answer:
      'Puede solicitar el servicio de bote cuando lo necesite, con reserva previa. Se cobran $5.66 por persona, por vía, cuando el servicio no es para check-in o check-out.',
    keywords: ['bote', 'salir', 'costo', 'traslado', 'cuándo'],
  },
  {
    ref: 87,
    category: 'general',
    question: 'Quiero información del hotel.',
    answer:
      'Isla Chiquita Glamping Hotel ofrece alojamiento de 4 estrellas en Puntarenas, frente a la playa, con piscina al aire libre, jardín y terraza. Cuenta con restaurante, bar e instalaciones para deportes acuáticos. Hay un restaurante de cocina local y parqueo privado gratuito. Todas las habitaciones disponen de armario, abanicos, caja de seguridad y otras amenidades; solo una incluye cocina. Estamos muy cerca de San José, ubicados en Isla Jesusita, Golfo de Nicoya, frente al embarcadero del ferry de Paquera. El concepto es glamping (tiendas de campaña de lujo). Hay restaurante a la carta, servicios de spa, piscina, y el uso de kayaks y tablas de remo está incluido en el hospedaje; además tenemos otros tours guiados por costo extra.',
    keywords: ['información', 'hotel', 'sobre', 'glamping', 'general', 'qué es'],
  },
  {
    ref: 88,
    category: 'gastronomia',
    question: '¿A qué número de teléfono puedo llamar para reservar almuerzos o cenas?',
    answer: 'Durante los fines de semana puede llamar al 2103-1464.',
    keywords: ['teléfono', 'reservar', 'almuerzo', 'cena', 'llamar'],
  },
  {
    ref: 89,
    category: 'gastronomia',
    question: '¿Tienen sistema todo incluido?',
    answer:
      'No, el hotel no tiene sistema todo incluido, pero ofrecemos la opción de tener los 3 tiempos de alimentación incluidos.',
    keywords: ['todo incluido', 'all inclusive', 'plan', 'alimentación'],
  },
  {
    ref: 90,
    category: 'llegar',
    question: '¿Cómo puedo reservar transporte?',
    answer:
      'Puede escribir al correo reserve@islachiquita.com o al WhatsApp +506 8775 8600 para coordinar su servicio de transporte.',
    keywords: ['reservar transporte', 'traslado', 'whatsapp', 'correo', 'coordinar'],
  },
  {
    ref: 91,
    category: 'reservas',
    question: 'Necesito cambiar la fecha de mi reservación actual.',
    answer:
      'Puede escribir al correo reserve@islachiquita.com o al WhatsApp +506 8775 8600 para atender su solicitud.',
    keywords: ['cambiar fecha', 'modificar', 'reservación', 'reprogramar'],
  },
  {
    ref: 92,
    category: 'alojamiento',
    question: '¿El hotel tiene alguna habitación con jacuzzi?',
    answer:
      'No, ninguna habitación tiene jacuzzi con agua caliente, pero sí tenemos algunas con piscina pequeña privada: la Family Tent, las Suite Premium, la Master Sunset Suite y la Casita.',
    keywords: ['jacuzzi', 'tina', 'piscina privada', 'habitaciones'],
  },
  {
    ref: 93,
    category: 'reservas',
    question: '¿Qué incluye mi reservación de hospedaje?',
    answer:
      'Toda reserva de hospedaje incluye: desayuno, uso de kayaks y tablas de remo durante toda la estadía, y el traslado ida y vuelta en bote desde Paquera hasta el hotel.',
    keywords: ['incluye', 'reservación', 'hospedaje', 'desayuno', 'kayak', 'traslado'],
  },
]
