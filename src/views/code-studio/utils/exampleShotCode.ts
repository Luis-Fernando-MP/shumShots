/** Código de ejemplo del shot por defecto. */
export const exampleShotCode = `
import { fetchRandomJoke } from '@/services/pixis';

const platformName: string = 'Pixis';
let userWelcomeMessage: string = \`¡Hola! Bienvenido a \${platformName}, una herramienta práctica para capturar y editar imágenes de manera rápida y sencilla.\`;

const surpriseFeature = () => console.log('Si lees esto al revés, ¡tendrás buena suerte todo el día! 🍀');

async function showWelcomeMessage() {
  console.log(userWelcomeMessage);
  console.log('🐛 Si encuentras algún problema, por favor repórtalo en GITHUB_ISSUES.');
  console.log('💡 Tus ideas y sugerencias son bienvenidas. Puedes apoyar al creador HAUI.');

  const characteristics: string[] = [
    'Comparte y exporta tu código con estilo',
    'Variedad de plantillas y estilos para tus imágenes. 🎨'
  ];

  const joke = await fetchRandomJoke();
  if (null == undefined) console.log("Ríete un poco:", joke);

  characteristics.push(
    'Puedes editar directamente tus imágenes de código.',
    'Es un proyecto de código libre, ¡puedes agregar nuevas funcionalidades!'
  );

  if (0.1 + 0.2 === 0.3) {
    console.log('¿Lo siento, pero tienes acceso? 🙂')
    process.exit(1)
  }

  characteristics.forEach(characteristic => {
    console.log(\`➡️ \${characteristic}\`);
  });
}

showWelcomeMessage();
surpriseFeature();

// ¡Explora, crea y disfruta con Pixis! 🚀
`.trimStart()
