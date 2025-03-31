const user = {
  name: 'Герой',
  health: 100,
  power: 10,
  defense: 5,
  level: 1,
  equipment: ['Зелье здоровья', 'Щит', 'Сила'],
  experience: [],

  attack(enemy) {
    enemy.health -= (this.power - enemy.defense);

    if (enemy.health <= 0) {
      enemy.health = 0;
      this.upgrade;
      this.receiveExperience;
      this.power += 2;
      this.defense += 2;
      this.level++;
      logEntry(`Герой атаковал и победил ${enemy.name}а. Герой повысил уровень до ${this.level}. Состояние Героя: Здоровье ${this.health} Сила ${this.power} Защита ${this.defense}.`);
      blockGame();
      if (thisUserLocation == forest) {
        user.experience.push('forest');
        forestIcon.classList.remove('inactive');
      }
      if (thisUserLocation == dungeon) {
        user.experience.push('dungeon');
        dungeonIcon.classList.remove('inactive');
      }
      if (thisUserLocation == village) {
        user.experience.push('village');
        villageIcon.classList.remove('inactive');
      }
      setUserState();
      setEnemyState();
    }

    else {
      logEntry(`${this.name} атаковал ${enemy.name}a на ${this.power - enemy.defense} урона. Здоровье ${enemy.name}a: ${enemy.health}.`);
      enemyAttack();
      setUserState();
      setEnemyState();
    }
    checkgameStatus();
  },

  defend() {
    this.defense += 2;
    setUserState();
    logEntry(`Герой защищается. Защита Героя: ${this.defense}.`);
    enemyAttack();
  },

  useEquipment(equipment) {
    for (let i = 0; i < this.equipment.length; i++) {
      if (this.equipment[i] == equipment) {
        this.equipment.splice(i, 1);
        return true;
      }
    }
    logEntry(`У Героя нет ${equipment}`)
    return false;
  },

  upgrade() {
    this.level += 1;
  },

  receiveExperience(location) {
    this.experience += location.name;
  },

  downgrade() {
    if (shield) {
      logEntry('Герой защищен от нападения.');
    }
    if (this.health < 0) {
      this.health = 0;
      logEntry('Герой погиб. Игра окончена.');
    }
  }
}

const goblin = {
  name: 'Гоблин',
  health: 30,
  power: 13,
  defense: 2,
}

const orc = {
  name: 'Орк',
  health: 50,
  power: 11,
  defense: 4,
}

const dragon = {
  name: 'Дракон',
  health: 70,
  power: 15,
  defense: 8,
}

const forest = {
  name: 'Лес'
}

const dungeon = {
  name: 'Подземелье'
}

const village = {
  name: 'Деревня'
}

let shield = false;

const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');

const attackButton = document.getElementById('attack');
const defendButton = document.getElementById('defend');

const equipmentBlock = document.getElementById('equipment-block');
const usePotionButton = document.getElementById('use-potion');
const useShieldButton = document.getElementById('use-shield');
const usePowerButton = document.getElementById('use-power');

const goForestButton = document.getElementById('forest');
const goDungeonButton = document.getElementById('dungeon');
const goVillageButton = document.getElementById('village');

const forestIcon = document.getElementById('forest-icon');
const dungeonIcon = document.getElementById('dungeon-icon');
const villageIcon = document.getElementById('village-icon');

const userName = document.getElementById('name');
const userHealth = document.getElementById('health');
const userPower = document.getElementById('power');
const userDefense = document.getElementById('defense');
const userLevel = document.getElementById('level');
const userEquipment = document.getElementById('equipment');

const enemyName = document.getElementById('enemy-name');
const enemyHealth = document.getElementById('enemy-health');
const enemyPower = document.getElementById('enemy-power');
const enemyDefense = document.getElementById('enemy-defense');

const userLocation = document.getElementById('location');

const logBlock = document.getElementById('log-block');

let enemy = null;
let thisUserLocation = null;

function setEquipment() {
  let str = '';
  for (let i = 0; i < user.equipment.length; i++) {
    str += user.equipment[i] + '   '
  }
  userEquipment.innerText = str;
}

function setUserState() {
  userName.innerText = user.name;
  userHealth.innerText = user.health;
  userPower.innerText = user.power;
  userDefense.innerText = user.defense;
  userLevel.innerText = user.level;
  setEquipment();
}

function setEnemyState() {
  enemyName.innerText = enemy.name;
  enemyHealth.innerText = enemy.health;
  enemyPower.innerText = enemy.power;
  enemyDefense.innerText = enemy.defense;
}

function logEntry(text) {
  const element = document.createElement('span');
  element.innerText = text;
  logBlock.appendChild(element);
  logBlock.scrollTop = logBlock.scrollHeight;
}

function enemyAttack() {
  if (shield) {
    return;
  }
  if ((enemy.power - user.defense) > 0){
    user.health -= (enemy.power - user.defense);
    user.downgrade();
    logEntry(`${enemy.name} атаковал Героя на ${enemy.power - user.defense} урона. Здоровье Героя ${user.health}.`);
    setUserState()
  }  
  else {
    logEntry(`У Врага недостаточно силы, чтобы атаковать Героя.`);
  }
}

function checkgameStatus() {
  if (user.experience.includes('forest') && user.experience.includes('dungeon') && user.experience.includes('village')) {
    userLocation.innerText = `Герой одержал полную победу! Перезапустить игру?`;
    logEntry(`Герой одержал полную победу! Перезапустить игру?`);
    blockGame();
  }
  if ((goForestButton.classList.contains('inactive')) && (goDungeonButton.classList.contains('inactive')) && (goVillageButton.classList.contains('inactive'))) {
    if ((user.health <= 0) && (enemy.health > 0))  {
      userLocation.innerText = `Герой проиграл! Перезапустить игру?`;
      logEntry(`Герой проиграл! Перезапустить игру?`);
      blockGame();
    }
    if ((user.health > 0) && (enemy.health <= 0) && (user.experience.length < 3)) {
      userLocation.innerText = `Все локации посещены, но не все враги побеждены. Герой проиграл! Перезапустить игру?`;
      logEntry(`Все локации посещены, но не все враги побеждены. Герой проиграл! Перезапустить игру?`);
      blockGame();
    }
  }
}

function blockGame() {
  attackButton.classList.add('inactive');
  defendButton.classList.add('inactive');
  usePotionButton.classList.add('inactive');
  usePowerButton.classList.add('inactive');
  useShieldButton.classList.add('inactive');
}

function unBlockGame() {
  attackButton.classList.remove('inactive');
  defendButton.classList.remove('inactive');
  for (let i = 0; i < user.equipment.length; i++) {
    if (user.equipment[i] == 'Зелье здоровья') {
      usePotionButton.classList.remove('inactive');
    }
    if (user.equipment[i] == 'Щит') {
      useShieldButton.classList.remove('inactive');
    }
    if (user.equipment[i] == 'Сила') {
      usePowerButton.classList.remove('inactive');
    }    
  }
}

function startGame() {
  startButton.classList.add('inactive');
  restartButton.classList.remove('inactive');
  equipmentBlock.classList.remove('inactive');
  goForestButton.classList.remove('inactive');
  goDungeonButton.classList.remove('inactive');
  goVillageButton.classList.remove('inactive');
  blockGame();
  setUserState();
  logEntry('Вы готовы к бою...');
}

startButton.addEventListener('click', function () {
  if (!startButton.classList.contains('inactive')) {
    startGame();
  }
})

restartButton.addEventListener('click', function () {
  if (!restartButton.classList.contains('inactive')) {
    location.reload();
  }
})

attackButton.addEventListener('click', function () {
  if (!attackButton.classList.contains('inactive')) {
    user.attack(enemy);
  }
})

defendButton.addEventListener('click', function () {
  if (!defendButton.classList.contains('inactive')) {
    user.defend();
  }
})

usePotionButton.addEventListener('click', function () {
  if ((!usePotionButton.classList.contains('inactive')) && (user.useEquipment('Зелье здоровья'))) {
    user.health += 20;
    if (user.health > 100) {
      user.health = 100;
    }
    setUserState();
    setEnemyState();
    usePotionButton.classList.add('inactive');
    logEntry(`Герой использовал Зелье здоровья (+20). Здоровье восстановлено до: ${user.health}.`);
    enemyAttack();
  }
})

useShieldButton.addEventListener('click', function () {
  if ((!useShieldButton.classList.contains('inactive')) && (user.useEquipment('Щит'))) {
    shield = true;
    setUserState();
    setEnemyState();
    useShieldButton.classList.add('inactive');
    logEntry(`Герой использовал Щит. В текущей локации Герой защищен от нападений.`);
    enemyAttack();
  }
})

usePowerButton.addEventListener('click', function () {
  if ((!usePowerButton.classList.contains('inactive')) && (user.useEquipment('Сила'))) {
    user.power += 5;
    setUserState();
    setEnemyState();
    usePowerButton.classList.add('inactive');
    logEntry(`Герой использовал Силу. Сила: ${user.power}.`);
    enemyAttack();
  }
})

goForestButton.addEventListener('click', function () {
  if ((!goForestButton.classList.contains('inactive')) && (!user.experience.includes('forest'))) {
    thisUserLocation = forest;
    userLocation.innerText = 'Лес';
    shield = false;
    goForestButton.classList.add('inactive');
    unBlockGame();
    logEntry(`Герой переместился в Лес.`);
    enemy = goblin;
    setEnemyState();
    logEntry(`Героя атакует Гоблин! Состояние Гоблина: Здоровье ${enemy.health} Сила ${enemy.power} Защита ${enemy.defense}.`);
  }
})

goDungeonButton.addEventListener('click', function () {
  if ((!goDungeonButton.classList.contains('inactive')) && (!user.experience.includes('dungeon'))) {
    thisUserLocation = dungeon;
    userLocation.innerText = 'Подземелье';
    shield = false;
    goDungeonButton.classList.add('inactive');
    unBlockGame();
    logEntry(`Герой переместился в Подземелье.`);
    enemy = dragon;
    setEnemyState();
    logEntry(`Героя атакует Дракон! Состояние Дракона: Здоровье ${enemy.health} Сила ${enemy.power} Защита ${enemy.defense}.`);
  }
})

goVillageButton.addEventListener('click', function () {
  if ((!goVillageButton.classList.contains('inactive')) && (!user.experience.includes('village'))) {
    thisUserLocation = village;
    userLocation.innerText = 'Деревня';
    shield = false;
    goVillageButton.classList.add('inactive');
    unBlockGame();
    logEntry(`Герой переместился в Деревню.`);
    enemy = orc;
    setEnemyState();
    logEntry(`Героя атакует Орк! Состояние Орка: Здоровье ${enemy.health} Сила ${enemy.power} Защита ${enemy.defense}.`);
  }
})
