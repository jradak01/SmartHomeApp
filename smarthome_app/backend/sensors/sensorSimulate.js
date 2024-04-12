// random value
const simulateSensor = (maxValue) => {
  const measurement = Math.round(Math.random() * maxValue);
  return measurement;
}
// save mesurment
const simulateChangingSongs = () => {
  const songs = [
    'Dancing Queen',
    'Bohemian Rhapsody',
    'Hotel California',
    'Imagine',
    'Hey Jude',
    'Stairway to Heaven',
    'Like a Rolling Stone',
    'Smells Like Teen Spirit',
    'Sweet Child o\' Mine',
    'Wonderwall',
    'Billie Jean',
    'Let It Be',
    'Piano Man',
    'Back in Black',
    'Hallelujah',
    'Yesterday',
    'Don\'t Stop Believin\'',
    'The Sound of Silence',
    'I Will Always Love You',
    'All Along the Watchtower',
    'We Will Rock You',
    'Imagine',
    'Another Brick in the Wall',
    'Hey Ya!',
    'Don\'t Stop Me Now',
    'Purple Haze',
    'Paint It Black',
    'Heroes',
    'Heart-Shaped Box',
    'Wish You Were Here'
  ];
  const randomIndex = Math.floor(Math.random() * songs.length);
  const randomSong = songs[randomIndex];
  return randomSong;
}
const simulateChangingTV = () => {
  const tvPrograms = [
    'HRT1',
    'HRT2',
    'Nova TV',
    'RTL',
    'Doma TV',
    'RTL2',
    'N1',
    'Croatia TV',
    'RTL Kockica',
    'HRT3',
    'HRT4',
    'HRT Plus',
    'HRT International',
    'HRT Vijesti',
    'Sportska televizija',
    'Nickelodeon',
    'ID Extra',
    'TLC'
  ];

  const randomIndex = Math.floor(Math.random() * tvPrograms.length);
  const randomProgram = tvPrograms[randomIndex];
  return randomProgram;

}
const simulateUsersInHouse = () => {
  const randomBoolean = Math.random() < 0.5;
  return randomBoolean;
}

const simulateWiFi = () => {
  const strengths = [
    'strength0',
    'strength1',
    'strength3',
    'strength4'
  ]
  const randomIndex = Math.floor(Math.random() * strengths.length);
  const randomStrength = strengths[randomIndex];
  return randomStrength;
}

const simulateAlerts = () => {
  const houseAlerts = [
    "Intrusion detected: Check security cameras and footage to identify the intruder(s). Contact local law enforcement and report the break-in. If necessary, activate the alarm system and secure the house.",
    "Fire alarm triggered: Immediately evacuate all occupants from the house and call the fire department. Attempt to locate the source of the fire and, if safe to do so, use a fire extinguisher. Stay away from smoke and open flames.",
    "Water leak detected: Shut off the main water valve to stop the water flow. Turn off electricity in areas exposed to water to avoid the risk of electrical shock. Call a professional plumber to fix the leak and inform them about the situation.",
    "Window or door opened: Check security cameras to identify who opened the window or door. If it's an authorized person, no further action may be needed. If it's unauthorized, contact the authorities or take appropriate security measures.",
    "Carbon monoxide detected: Evacuate all occupants from the house immediately and call emergency services. Move to a safe location with fresh air and avoid inhaling carbon monoxide. Do not re-enter the house until it has been deemed safe by professionals.",
    "Power outage: Check the circuit breaker to ensure it hasn't tripped. Reset if necessary. If the outage is widespread, contact the utility company to report the outage and inquire about estimated restoration time. Use alternative lighting sources and avoid opening the refrigerator to preserve food.",
  ];
  const randomIndex = Math.floor(Math.random() * houseAlerts.length);
  const randomAlert = houseAlerts[randomIndex];
  return randomAlert;
}

module.exports = {
  simulateSensor,
  simulateChangingSongs,
  simulateChangingTV,
  simulateUsersInHouse,
  simulateWiFi,
  simulateAlerts
}