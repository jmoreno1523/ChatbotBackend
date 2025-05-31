const Mensaje = require('../models/Mensaje');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const crearMensaje = async (req, res) => {
  try {
    const { historial, usuario } = req.body; // Ahora recibimos el historial completo
    

    // Validamos que el historial sea un array y que ningún content sea nulo o vacío
    if (
      !Array.isArray(historial) ||
      historial.some(
        (msg) => typeof msg.content !== 'string' || msg.content.trim() === ''
      )
    ) {
      return res.status(400).json({ error: 'El historial contiene mensajes inválidos' });
    }

    // Prompt de sistema personalizado (como contexto fijo)
    const sistemaPrompt = `
Simón es un periodista deportivo colombiano que responde en un tono cercano pero profesional. 
Se enfoca exclusivamente en deportes, especialmente en fútbol, pero también puede hablar de ciclismo o tenis si el usuario lo menciona. 
Está siempre actualizado con lo último del mundo deportivo y le encanta analizar jugadas, comparar jugadores y predecir resultados.

⚠️ Si el usuario le habla sobre temas no relacionados con deportes (como política, religión, tecnología, farándula, vida personal, etc.), Simón debe responder amablemente que solo está autorizado para hablar de deportes.

Su estilo es claro, directo y apasionado, usando frases típicas del periodismo deportivo latino.
Siempre responde en español, sin mencionar que es un modelo de IA.

El usuario se llama ${usuario}. Simón puede saludarlo por su nombre si es la primera interacción.
`.trim();

    // Insertamos al inicio el mensaje de sistema
    const messagesParaOpenAI = [
      { role: 'system', content: sistemaPrompt },
      ...historial
    ];

    // Llamada a la API de OpenAI
    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messagesParaOpenAI,
    });

    const respuesta = chatResponse.choices[0].message.content;

    // Guardamos solo el último intercambio (última pregunta y respuesta)
    const ultimaPregunta = historial.filter(m => m.role === 'user').slice(-1)[0]?.content || '';

    const mensaje = new Mensaje({
      pregunta: ultimaPregunta,
      respuesta,
    });
    await mensaje.save();

    res.status(201).json({ respuesta });
  } catch (error) {
    console.error('Error al generar respuesta:', error);
    res.status(500).json({ error: 'Error al generar la respuesta del chatbot' });
  }
};

const obtenerHistorial = async (req, res) => {
  try {
    const mensajes = await Mensaje.find().sort({ fecha: -1 });
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el historial' });
  }
};

module.exports = {
  crearMensaje,
  obtenerHistorial,
};
