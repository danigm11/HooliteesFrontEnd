import { Component } from '@angular/core';

@Component({
  selector: 'app-sobre-nosotros',
  templateUrl: './sobre-nosotros.component.html',
  styleUrls: ['./sobre-nosotros.component.css']
})
export class SobreNosotrosComponent {
  teamMembers = [
    {
      name: 'Daniel García Mesa',
      description: 'Soy una persona resolutiva y trabajadora, creo que puedo aportar organización, ética de trabajo y ayuda al equipo con los problemas que puedan surgir, me siento capacitado para liderar este proyecto gracias a la confianza que noto en mí por parte de mis compañeros.',
      image: '../../assets/images/user.png'
    },
    {
      name: 'Jorge Reina Romero',
      description: 'Soy una persona cooperativa y que le gusta trabajar en equipo, me gusta realizar mis trabajos a tiempo y siempre compartir o preguntar a mis compañeros sobre dudas o nuevas ideas.',
      image: '../../assets/images/user.png'
    },
    {
      name: 'Miguel Blanco Fernández',
      description: 'Soy una persona trabajadora y constante, a pesar de mi aparente falta de acción, soy bastante energético y diligente con los trabajos que se me asignan y trabajo bastante bien en equipo.',
      image: '../../assets/images/user.png'
    },
    {
      name: 'Oscar Mateo Martín',
      description: 'Soy una persona responsable y proactiva, creo que puedo aportar al equipo todo lo que sea necesario para sacar adelante el proyecto y me gusta cooperar con mis compañeros.',
      image: '../../assets/images/user.png'
    }
  ];
  missionVisionValues = {
    mission: '"Nuestra mision es facilitar a nuestros clientes en todo el mundo el acceso a réplicas de alta calidad de camisetas de fútbol y NBA, permitiéndoles expresar su pasión por sus equipos y jugadores favoritos de manera asequible. Nos comprometemos a ofrecer productos que respeten los estándares de autenticidad en diseño y materiales, proporcionando una experiencia de compra online conveniente y fiable."',
    vision: '"Nuestra visión es ser reconocidos como el principal destino online para la adquisición de réplicas de camisetas de fútbol y NBA, destacándonos por la calidad insuperable de nuestros productos y la satisfacción del cliente. Aspiramos a ser la opción preferida de los aficionados, construyendo una comunidad que comparta la emoción del deporte a través de nuestras camisetas."',
    values: ['Calidad Garantizada', 'Transparencia', 'Accesibilidad', 'Servicio Confiable']
  };

  contactInfo = {
    phone: '952000000',
    address: 'C. Frederick Terman, 3, Campanillas, 29590 Málaga'
  };
}

