function reset() {
	game = {
    charge: OmegaNum(0),
    maxCharge: OmegaNum(100),
    chargeRate: OmegaNum(1),
    chargerCost: OmegaNum(10),
    chargersBought: OmegaNum(0),
    boostersBought: OmegaNum(0),
    modifiersBought: OmegaNum(0),

    timePlayed: 0,
    achievementsGot: 0,

    upgradesUnlocked: false,
    upgradesBought: [false, false, false, false, false, false, false, false],

    cosmicMatter: OmegaNum(0),
    fireEssence: OmegaNum(0),
    fire: OmegaNum(0),
    waterEssence: OmegaNum(0),
    water: OmegaNum(0),

    amplifierCost: OmegaNum(1e40),
    amplifiersBought: OmegaNum(0),

    cosmicUpgradesUnlocked: false,
    cosmicUpgradesBought: [false, false, false, false, false, false, false],

    starMatterUnlocked: false,
    starMatter: OmegaNum(0),
    sm1Cost: OmegaNum(10000),
    sm1Bought: OmegaNum(0),
    sm2Cost: OmegaNum(50000),
    sm2Bought: OmegaNum(0),
    sm3Cost: OmegaNum(1e13),
    sm3Bought: OmegaNum(0),
    sm4Cost: OmegaNum(2e14),
    sm4Bought: OmegaNum(0),

    smBoostersUnlocked: false,
    sbBought: [0, 0, 0]
  }
}

reset()

function hardReset() {
  if (confirm("Are you sure you want to reset? You will lose everything!")) {
    reset()
    save()
    location.reload()
  }
}

function save() {
	localStorage.setItem("theBatterySave", JSON.stringify(game))
}

//setInterval(save, 5000)

function exportGame() {
  save()
  navigator.clipboard.writeText(btoa(JSON.stringify(game))).then(function() {
    alert("Copied to clipboard!")
  }, function() {
    alert("Error copying to clipboard, try again...")
  });
}

function importGame() {
  loadgame = JSON.parse(atob(prompt("Input your save here:")))
  if (loadgame && loadgame != null && loadgame != "") {
    reset()
    loadGame(loadgame)
    save()
  }
  else {
    alert("Invalid input.")
  }
}

function load() {
	reset()
	let loadgame = JSON.parse(localStorage.getItem("theBatterySave"))
	if (loadgame != null) {
		loadGame(loadgame)
	}
}

load()

function loadGame(loadgame) {
  //Sets each variable in 'game' to the equivalent variable in 'loadgame' (the saved file)
  for (i=0; i<Object.keys(loadgame).length; i++) {
    if (loadgame[Object.keys(loadgame)[i]] != "undefined") {
      if (typeof loadgame[Object.keys(loadgame)[i]] == "string") {game[Object.keys(loadgame)[i]] = new OmegaNum(loadgame[Object.keys(loadgame)[i]])}
      else {game[Object.keys(game)[i]] = loadgame[Object.keys(loadgame)[i]]}
    }
  }

  //Changes the state of the game based on game variables
  changeTab(1)
  for (i=0; i<achievementRequirements.length; i++) {
    document.getElementsByClassName("achievement")[i].style.color = "#ffff" + (255 - i * 10).toString(16)
    document.getElementsByClassName("achievement")[i].style.backgroundColor = null
  }
  document.getElementById("buyModifierButton").style.display = "none"
  document.getElementById("unlockUpgradesButton").style.display = "none"
  document.getElementsByClassName("tab")[1].style.display = "none"
  document.getElementsByClassName("tab")[2].style.display = "none"
  document.getElementById("buyAmplifierButton").style.display = "none"

  if (game.boostersBought.gt(0) || game.modifiersBought.gt(0)) document.getElementById("buyModifierButton").style.display = "block"
  if (game.modifiersBought.gt(0)) document.getElementById("unlockUpgradesButton").style.display = "block"

  for (i=0; i<game.achievementsGot; i++) {
    document.getElementsByClassName("achievement")[i].style.backgroundColor = "#b0b0b0"
  }

  if (game.upgradesUnlocked == true) {
    document.getElementById("unlockUpgradesButton").style.display = "none"
    document.getElementsByClassName("tab")[1].style.display = "block"
  }
  for (i=0; i<game.upgradesBought.length; i++) {
    if (game.upgradesBought[i] == true) {document.getElementsByClassName("upgrade")[i].disabled = true}
    else {document.getElementsByClassName("upgrade")[i].disabled = false}
  }
  if (game.upgradesBought[2] == true) document.getElementById("buyMaxChargersButton").style.display = "block"
  if (game.upgradesBought[7] == true) {
    document.getElementsByClassName("content")[6].style.display = "block"
    document.getElementById("buyAmplifierButton").style.display = "block"
    document.getElementById("unlockCosmicUpgradesButton").style.display = "block"
  }

  if (game.cosmicUpgradesUnlocked == true) {
    document.getElementById("unlockCosmicUpgradesButton").style.display = "none"
    document.getElementById("unlockStarMatterButton").style.display = "block"
  }
  for (i=0; i<game.cosmicUpgradesBought.length; i++) {
    if (game.cosmicUpgradesBought[i] == true) {document.getElementsByClassName("cosmicUpgrade")[i].disabled = true}
    else {document.getElementsByClassName("cosmicUpgrade")[i].disabled = false}
  }

  if (game.starMatterUnlocked == true) {
    document.getElementById("unlockStarMatterButton").style.display = "none"
    document.getElementById("unlockSMBoostersButton").style.display = "block"
    document.getElementsByClassName("tab")[2].style.display = "block"
    document.getElementsByClassName("cosmicUpgrade")[6].style.display = "block"
    document.getElementsByClassName("cosmicUpgrade")[7].style.display = "block"
  }

  if (game.smBoostersUnlocked == true) {
    document.getElementById("unlockSMBoostersButton").style.display = "none"
    document.getElementsByClassName("starMatterBooster")[0].style.display = "block"
    document.getElementsByClassName("starMatterBooster")[1].style.display = "block"
    document.getElementsByClassName("starMatterBooster")[2].style.display = "block"
  }

  update()
}

function update() {
  document.getElementById("batteryInner").style.backgroundColor = toColour(game.charge.toNumber())
  document.getElementById("batteryInner").style.width = Math.max(Math.min(game.charge.toNumber(), 100), 0) + "%"
  if (game.charge.gt(1e30)) {document.getElementById("battery").style.boxShadow = "0 0 26px rgba(255, 255, 255, 0.8)"}
  else if (game.charge.gt(100000)) {document.getElementById("battery").style.boxShadow = "0 0 " + (game.charge.sub(100000).div(10000).log10().toNumber()) + "px rgba(255, 255, 255, 0.8)"}
  else {document.getElementById("battery").style.boxShadow = null}
  document.getElementById("batteryText").innerHTML = "Charge: " + format(game.charge, 0) + "/" + format(game.maxCharge, 0)


  if (game.upgradesBought[3] == true) {
    game.maxCharge = OmegaNum(2).pow(game.boostersBought.mul(game.modifiersBought.add(1)))
    game.chargeRate = OmegaNum(1.5).pow(game.boostersBought.mul(game.modifiersBought.add(1)))
  }
  else {
    game.maxCharge = OmegaNum(2).pow(game.boostersBought.mul(game.modifiersBought.div(2).add(1)))
    game.chargeRate = OmegaNum(1.5).pow(game.boostersBought.mul(game.modifiersBought.div(2).add(1)))
  }
  game.maxCharge = game.maxCharge.mul(game.water.add(1)).mul(100)
  game.chargeRate = game.chargeRate.mul(game.chargersBought.div(3).add(1).pow(1.5)).mul(game.fire.add(1))

  if (game.upgradesBought[1] == true) game.chargeRate = game.chargeRate.mul(game.boostersBought)
  if (game.upgradesBought[4] == true) game.chargeRate = game.chargeRate.pow(1.2)
  if (game.upgradesBought[6] == true) game.chargeRate = game.chargeRate.mul(game.chargeRate.log10().mul(2))

  if (game.upgradesBought[5] == true) {game.chargerCost = OmegaNum(1.12).pow(game.chargersBought).mul(10)}
  else if (game.upgradesBought[0] == true) {game.chargerCost = OmegaNum(1.15).pow(game.chargersBought).mul(10)}
  else {game.chargerCost = OmegaNum(1.2).pow(game.chargersBought).mul(10)}

  document.getElementById("chargeRate").innerHTML = format(game.chargeRate, 1)
  document.getElementById("chargerCost").innerHTML = format(game.chargerCost, 0)
  document.getElementById("chargersBought").innerHTML = format(game.chargersBought, 0)
  if (game.chargersBought.gte(500)) {document.getElementById("chargersMaxed").innerHTML = "(MAX)"}
  else {document.getElementById("chargersMaxed").innerHTML = ""}

  document.getElementById("boostersBought").innerHTML = format(game.boostersBought, 0)
  if (game.boostersBought.lt(boosterCosts.length)) {document.getElementById("boosterCost").innerHTML = format(boosterCosts[game.boostersBought.toNumber()], 0)}
  else {document.getElementById("boosterCost").innerHTML = "Infinity"}
  document.getElementById("modifiersBought").innerHTML = format(game.modifiersBought, 0)
  if (game.modifiersBought.lt(modifierCosts.length)) {document.getElementById("modifierCost").innerHTML = format(modifierCosts[game.modifiersBought.toNumber()], 0)}
  else {document.getElementById("modifierCost").innerHTML = "Infinity"}
  if (game.charge.gte(achievementRequirements[game.achievementsGot])) {
    document.getElementsByClassName("achievement")[game.achievementsGot].style.backgroundColor = "#b0b0b0"
    game.achievementsGot++
  }

  document.getElementById("cosmicMatter").innerHTML = format(game.cosmicMatter, 0)
  game.amplifierCost = OmegaNum(10).pow(OmegaNum(40).mul(game.amplifiersBought.div(12).add(1).pow(1.65)))
  if (game.amplifierCost.gt(1e200)) game.amplifierCost = game.amplifierCost.pow(1.5).div(1e100)
  if (game.amplifierCost.gt("1e2500")) game.amplifierCost = game.amplifierCost.pow(2).div("1e2500")
  if (game.amplifierCost.gt("1e10000")) game.amplifierCost = game.amplifierCost.pow(5).div("1e40000")
  if (game.amplifierCost.gt("1e100000")) game.amplifierCost = game.amplifierCost.pow(100).div("1e9.9e6")
  document.getElementById("amplifierCost").innerHTML = format(game.amplifierCost, 0)
  document.getElementById("amplifiersBought").innerHTML = format(game.amplifiersBought, 0)
  if (game.amplifiersBought.gte(500)) {document.getElementById("amplifiersMaxed").innerHTML = "(MAX)"}
  else {document.getElementById("amplifiersMaxed").innerHTML = ""}

  document.getElementById("starMatter").innerHTML = format(game.starMatter, 0)
  game.sm1Cost = OmegaNum(10).pow(OmegaNum(10).pow(game.sm1Bought.div(50)).mul(4))
  document.getElementById("sm1Cost").innerHTML = format(game.sm1Cost, 0)
  document.getElementById("sm1Effect").innerHTML = format(OmegaNum(1e15).pow(game.sm1Bought.pow(2)), 0)
  game.sm2Cost = OmegaNum(10).pow(OmegaNum(10).pow(game.sm2Bought.div(20)).mul(4)).mul(5)
  document.getElementById("sm2Cost").innerHTML = format(game.sm2Cost, 0)
  document.getElementById("sm2Effect").innerHTML = format(OmegaNum(5).pow(game.sm2Bought), 0)
  game.sm3Cost = OmegaNum(10).pow(OmegaNum(10).pow(game.sm3Bought.div(10).pow(1.5)).mul(13))
  document.getElementById("sm3Cost").innerHTML = format(game.sm3Cost, 0)
  document.getElementById("sm3Effect").innerHTML = format(OmegaNum(6).pow(game.sm3Bought), 0)
  game.sm4Cost = OmegaNum(10).pow(OmegaNum(10).pow(game.sm4Bought.div(11)).mul(14)).mul(2)
  document.getElementById("sm4Cost").innerHTML = format(game.sm4Cost, 0)
  document.getElementById("sm4Effect").innerHTML = format(OmegaNum(10).pow(game.sm4Bought), 0)

  document.getElementById("sb1Cost").innerHTML = format(sb1Costs[game.sbBought[0]], 0)
  document.getElementById("sb2Cost").innerHTML = format(sb2Costs[game.sbBought[1]], 0)
  document.getElementById("sb3Cost").innerHTML = format(sb3Costs[game.sbBought[2]], 0)
  document.getElementById("sb1Bought").innerHTML = game.sbBought[0]
  document.getElementById("sb2Bought").innerHTML = game.sbBought[1]
  document.getElementById("sb3Bought").innerHTML = game.sbBought[2]
}

setInterval(update, 33)

function chargeUp() {
  game.charge = game.charge.add(game.chargeRate.div(50))
  if (game.charge.gt(game.maxCharge)) game.charge = game.maxCharge
}

setInterval(chargeUp, 20)

function buyCharger() {
  if (game.charge.gte(game.chargerCost) && game.chargersBought.lt(500)) {
    game.charge = game.charge.sub(game.chargerCost)
    game.chargersBought = game.chargersBought.add(1)
  }
}

function buyMaxChargers() {
  while (game.charge.gte(game.chargerCost) && game.chargersBought.lt(500)) {
    game.charge = game.charge.sub(game.chargerCost)
    game.chargersBought = game.chargersBought.add(1)
    if (game.upgradesBought[5] == true) {game.chargerCost = OmegaNum(1.12).pow(game.chargersBought).mul(10)}
    else if (game.upgradesBought[0] == true) {game.chargerCost = OmegaNum(1.15).pow(game.chargersBought).mul(10)}
    else {game.chargerCost = OmegaNum(1.2).pow(game.chargersBought).mul(10)}
  }
}

function buyBooster() {
  if (game.boostersBought.lt(boosterCosts.length)) {
    if (game.chargersBought.gte(boosterCosts[game.boostersBought.toNumber()])) {
      game.boostersBought = game.boostersBought.add(1)
      game.charge = OmegaNum(0)
      game.chargersBought = OmegaNum(0)
      document.getElementById("buyModifierButton").style.display = "block"
    }
  }
}

function buyModifier() {
  if (game.modifiersBought.lt(modifierCosts.length)) {
    if (game.charge.gte(modifierCosts[game.modifiersBought.toNumber()])) {
      game.modifiersBought = game.modifiersBought.add(1)
      game.boostersBought = OmegaNum(1)
      game.charge = OmegaNum(0)
      game.chargersBought = OmegaNum(0)
      if (game.upgradesUnlocked != true) document.getElementById("unlockUpgradesButton").style.display = "block"
    }
  }
}

function unlockUpgrades() {
  if (game.upgradesUnlocked != true && game.charge.gte(200000)) {
    game.charge = game.charge.sub(200000)
    game.upgradesUnlocked = true
    document.getElementById("unlockUpgradesButton").style.display = "none"
    document.getElementsByClassName("tab")[1].style.display = "block"
  }
}

function buyUpgrade(x) {
  if (x==1 && game.upgradesBought[0] != true && game.chargersBought.gte(45)) {
    game.chargersBought = game.chargersBought.sub(45)
    game.upgradesBought[0] = true
    document.getElementsByClassName("upgrade")[0].disabled = true
  }
  else if (x==2 && game.upgradesBought[1] != true && game.chargersBought.gte(75)) {
    game.chargersBought = game.chargersBought.sub(75)
    game.upgradesBought[1] = true
    document.getElementsByClassName("upgrade")[1].disabled = true
  }
  else if (x==3 && game.upgradesBought[2] != true && game.chargersBought.gte(95)) {
    game.chargersBought = game.chargersBought.sub(95)
    game.upgradesBought[2] = true
    document.getElementsByClassName("upgrade")[2].disabled = true
    document.getElementById("buyMaxChargersButton").style.display = "block"
  }
  else if (x==4 && game.upgradesBought[3] != true && game.chargersBought.gte(130)) {
    game.chargersBought = game.chargersBought.sub(130)
    game.upgradesBought[3] = true
    document.getElementsByClassName("upgrade")[3].disabled = true
  }
  else if (x==5 && game.upgradesBought[4] != true && game.chargersBought.gte(250)) {
    game.chargersBought = game.chargersBought.sub(250)
    game.upgradesBought[4] = true
    document.getElementsByClassName("upgrade")[4].disabled = true
  }
  else if (x==6 && game.upgradesBought[5] != true && game.chargersBought.gte(340)) {
    game.chargersBought = game.chargersBought.sub(340)
    game.upgradesBought[5] = true
    document.getElementsByClassName("upgrade")[5].disabled = true
  }
  else if (x==7 && game.upgradesBought[6] != true && game.chargersBought.gte(450)) {
    game.chargersBought = game.chargersBought.sub(450)
    game.upgradesBought[6] = true
    document.getElementsByClassName("upgrade")[6].disabled = true
  }
  else if (x==8 && game.upgradesBought[7] != true && game.chargersBought.gte(500)) {
    game.chargersBought = game.chargersBought.sub(500)
    game.upgradesBought[7] = true
    document.getElementsByClassName("upgrade")[7].disabled = true
    document.getElementById("buyAmplifierButton").style.display = "block"
    document.getElementById("unlockCosmicUpgradesButton").style.display = "block"
  }
}

function cosmicMatterUp() {
  if (game.upgradesBought[7] == true) {
    if (game.cosmicUpgradesBought[7] == true) {game.cosmicMatter = game.cosmicMatter.add(OmegaNum(10000).pow(game.amplifiersBought.pow(1.2).mul(OmegaNum(6).pow(game.sm3Bought))).mul(OmegaNum(1e15).pow(game.sm1Bought.pow(2)).pow(game.fire.log10().pow(0.45)).pow(game.water.log10().pow(0.3))).pow(1.5 ** game.sbBought[0]))}
    else if (game.cosmicUpgradesBought[6] == true) {game.cosmicMatter = game.cosmicMatter.add(OmegaNum(10000).pow(game.amplifiersBought.pow(1.2).mul(OmegaNum(6).pow(game.sm3Bought))).mul(OmegaNum(1e15).pow(game.sm1Bought.pow(2)).pow(game.fire.log10().pow(0.45))))}
    else if (game.cosmicUpgradesBought[5] == true) {game.cosmicMatter = game.cosmicMatter.add(OmegaNum(10000).pow(game.amplifiersBought.pow(1.2).mul(OmegaNum(6).pow(game.sm3Bought))).mul(OmegaNum(1e15).pow(game.sm1Bought.pow(2))))}
    else if (game.cosmicUpgradesBought[3] == true) {game.cosmicMatter = game.cosmicMatter.add(OmegaNum(10000).pow(game.amplifiersBought.pow(1.15)))}
    else if (game.cosmicUpgradesBought[1] == true) {game.cosmicMatter = game.cosmicMatter.add(OmegaNum(10000).pow(game.amplifiersBought.pow(1.11)))}
    else {game.cosmicMatter = game.cosmicMatter.add(OmegaNum(10000).pow(game.amplifiersBought.pow(1.05)))}
  }
}

setInterval(cosmicMatterUp, 1000)

function assignFire(x) {
  if (game.cosmicMatter.gt(0)) {
    if (x==1) {
      game.fireEssence = game.fireEssence.add(game.cosmicMatter)
      game.cosmicMatter = OmegaNum(0)
    }
    else if (x==2) {
      game.fireEssence = game.fireEssence.add(game.cosmicMatter.div(2).ceil())
      game.cosmicMatter = game.cosmicMatter.div(2).floor()
    }
    else if (x==3) {
      game.fireEssence = game.fireEssence.add(game.cosmicMatter.div(10).ceil())
      game.cosmicMatter = game.cosmicMatter.sub(game.cosmicMatter.div(10).ceil())
    }
    else {
      game.fireEssence = game.fireEssence.add(1)
      game.cosmicMatter = game.cosmicMatter.sub(1)
    }
  }
}

function assignWater(x) {
  if (game.cosmicMatter.gt(0)) {
    if (x==1) {
      game.waterEssence = game.waterEssence.add(game.cosmicMatter)
      game.cosmicMatter = OmegaNum(0)
    }
    else if (x==2) {
      game.waterEssence = game.waterEssence.add(game.cosmicMatter.div(2).ceil())
      game.cosmicMatter = game.cosmicMatter.div(2).floor()
    }
    else if (x==3) {
      game.waterEssence = game.waterEssence.add(game.cosmicMatter.div(10).ceil())
      game.cosmicMatter = game.cosmicMatter.sub(game.cosmicMatter.div(10).ceil())
    }
    else {
      game.waterEssence = game.waterEssence.add(1)
      game.cosmicMatter = game.cosmicMatter.sub(1)
    }
  }
}

function matterUp() {
  document.getElementById("fireEssence").innerHTML = format(game.fireEssence, 0)
  if (game.cosmicUpgradesBought[4] == true) {
    game.fire = game.fire.add(game.fireEssence.pow(1.5).div(10).mul(game.cosmicMatter.add(1).pow(0.2)).pow(5 ** game.sbBought[1]))
    document.getElementById("firePerSecond").innerHTML = format(game.fireEssence.pow(1.5).mul(5).mul(game.cosmicMatter.add(1).pow(0.2)), 0)
  }
  else {
    game.fire = game.fire.add(game.fireEssence.pow(1.5).div(10))
    document.getElementById("firePerSecond").innerHTML = format(game.fireEssence.pow(1.5).mul(5), 0)
  }
  document.getElementById("fire").innerHTML = format(game.fire, 0)
  document.getElementById("waterEssence").innerHTML = format(game.waterEssence, 0)
  if (game.cosmicUpgradesBought[4] == true) {
    game.water = game.water.add(game.waterEssence.pow(1.7).div(10).mul(game.cosmicMatter.add(1).pow(0.2)).pow(5 ** game.sbBought[1]))
    document.getElementById("waterPerSecond").innerHTML = format(game.waterEssence.pow(1.7).mul(5).mul(game.cosmicMatter.add(1).pow(0.2)), 0)
  }
  else if (game.cosmicUpgradesBought[0] == true) {
    game.water = game.water.add(game.waterEssence.pow(1.7).div(10))
    document.getElementById("waterPerSecond").innerHTML = format(game.waterEssence.pow(1.7).mul(5), 0)
  }
  else {
    game.water = game.water.add(game.waterEssence.pow(1.5).div(10))
    document.getElementById("waterPerSecond").innerHTML = format(game.waterEssence.pow(1.5).mul(5), 0)
  }
  document.getElementById("water").innerHTML = format(game.water, 0)
}

setInterval(matterUp, 20)

function buyAmplifier() {
  if (game.charge.gte(game.amplifierCost) && game.amplifiersBought.lt(500)) {
    game.charge = game.charge.sub(game.amplifierCost)
    game.amplifiersBought = game.amplifiersBought.add(1)
    if (game.cosmicUpgradesBought[2] == true) game.modifiersBought = game.modifiersBought.add(1)
  }
}

function unlockCosmicUpgrades() {
  if (game.cosmicUpgradesUnlocked != true && game.charge.gte(1e115)) {
    game.charge = game.charge.sub(1e115)
    game.cosmicUpgradesUnlocked = true
    document.getElementById("unlockCosmicUpgradesButton").style.display = "none"
    document.getElementById("unlockStarMatterButton").style.display = "block"
  }
}

function buyCosmicUpgrade(x) {
  if (x==1 && game.cosmicUpgradesBought[0] != true && game.amplifiersBought.gte(12)) {
    game.amplifiersBought = game.amplifiersBought.sub(12)
    game.cosmicUpgradesBought[0] = true
    document.getElementsByClassName("cosmicUpgrade")[0].disabled = true
  }
  else if (x==2 && game.cosmicUpgradesBought[1] != true && game.amplifiersBought.gte(20)) {
    game.amplifiersBought = game.amplifiersBought.sub(20)
    game.cosmicUpgradesBought[1] = true
    document.getElementsByClassName("cosmicUpgrade")[1].disabled = true
  }
  else if (x==3 && game.cosmicUpgradesBought[2] != true && game.amplifiersBought.gte(26)) {
    game.cosmicUpgradesBought[2] = true
    document.getElementsByClassName("cosmicUpgrade")[2].disabled = true
    game.modifiersBought = game.modifiersBought.add(game.amplifiersBought)
  }
  else if (x==4 && game.cosmicUpgradesBought[3] != true && game.amplifiersBought.gte(42)) {
    game.cosmicUpgradesBought[3] = true
    document.getElementsByClassName("cosmicUpgrade")[3].disabled = true
  }
  else if (x==5 && game.cosmicUpgradesBought[4] != true && game.amplifiersBought.gte(54)) {
    game.cosmicUpgradesBought[4] = true
    document.getElementsByClassName("cosmicUpgrade")[4].disabled = true
  }
  else if (x==6 && game.cosmicUpgradesBought[5] != true && game.amplifiersBought.gte(68)) {
    game.cosmicUpgradesBought[5] = true
    document.getElementsByClassName("cosmicUpgrade")[5].disabled = true
  }
  else if (x==7 && game.cosmicUpgradesBought[6] != true && game.starMatter.gte(1e22)) {
    game.cosmicUpgradesBought[6] = true
    document.getElementsByClassName("cosmicUpgrade")[6].disabled = true
  }
  else if (x==8 && game.cosmicUpgradesBought[7] != true && game.starMatter.gte(1e24)) {
    game.cosmicUpgradesBought[7] = true
    document.getElementsByClassName("cosmicUpgrade")[7].disabled = true
  }
}

function unlockStarMatter() {
  if (game.starMatterUnlocked != true && game.charge.gte("1e2500")) {
    game.starMatterUnlocked = true
    document.getElementById("unlockStarMatterButton").style.display = "none"
    document.getElementById("unlockSMBoostersButton").style.display = "block"
    document.getElementsByClassName("tab")[2].style.display = "block"
    document.getElementsByClassName("cosmicUpgrade")[6].style.display = "block"
    document.getElementsByClassName("cosmicUpgrade")[7].style.display = "block"
  }
}

function starMatterUp() {
  if (game.starMatterUnlocked == true) {
    game.starMatter = game.starMatter.add(game.cosmicMatter.add(1).log10().mul(OmegaNum(5).pow(game.sm2Bought)).mul(OmegaNum(10).pow(game.sm4Bought).pow(1.3 ** game.sbBought[2])).floor())
    if (game.starMatter.lt(0)) game.starMatter = OmegaNum(0)
  }
}

setInterval(starMatterUp, 1000)

function buySM1() {
  if (game.starMatter.gte(game.sm1Cost)) {
    game.starMatter = game.starMatter.sub(game.sm1Cost)
    game.sm1Bought = game.sm1Bought.add(1)
  }
}

function buySM2() {
  if (game.starMatter.gte(game.sm2Cost)) {
    game.starMatter = game.starMatter.sub(game.sm2Cost)
    game.sm2Bought = game.sm2Bought.add(1)
  }
}

function buySM3() {
  if (game.starMatter.gte(game.sm3Cost)) {
    game.starMatter = game.starMatter.sub(game.sm3Cost)
    game.sm3Bought = game.sm3Bought.add(1)
  }
}

function buySM4() {
  if (game.starMatter.gte(game.sm4Cost)) {
    game.starMatter = game.starMatter.sub(game.sm4Cost)
    game.sm4Bought = game.sm4Bought.add(1)
  }
}

function unlockSMBoosters() {
  if (game.smBoostersUnlocked != true && game.charge.gte("ee19")) {
    game.smBoostersUnlocked = true
    document.getElementById("unlockSMBoostersButton").style.display = "none"
    document.getElementsByClassName("starMatterBooster")[0].style.display = "block"
    document.getElementsByClassName("starMatterBooster")[1].style.display = "block"
    document.getElementsByClassName("starMatterBooster")[2].style.display = "block"
  }
}


function buySB1() {
  if (game.starMatter.gte(sb1Costs[game.sbBought[0]]) && game.sbBought[0] < 9) {
    game.sbBought[0]++
  }
}

function buySB2() {
  if (game.starMatter.gte(sb2Costs[game.sbBought[1]]) && game.sbBought[1] < 5) {
    game.sbBought[1]++
  }
}

function buySB3() {
  if (game.starMatter.gte(sb3Costs[game.sbBought[2]]) && game.sbBought[2] < 3) {
    game.sbBought[2]++
  }
}










function changeTab(x) {
  document.getElementsByClassName("content")[0].style.display = "none"
  document.getElementsByClassName("content")[1].style.display = "none"
  document.getElementsByClassName("content")[2].style.display = "none"
  document.getElementsByClassName("content")[3].style.display = "none"
  document.getElementsByClassName("content")[4].style.display = "none"
  document.getElementsByClassName("content")[5].style.display = "none"
  document.getElementsByClassName("content")[6].style.display = "none"
  document.getElementsByClassName("content")[7].style.display = "none"
  document.getElementsByClassName("content")[8].style.display = "none"
  document.getElementById("achievementInfo").style.display = "none"
  if (x==1) {
    document.getElementsByClassName("content")[2].style.display = "block"
    document.getElementsByClassName("content")[3].style.display = "block"
    if (game.upgradesBought[7] == true) document.getElementsByClassName("content")[6].style.display = "block"
  }
  else if (x==2) {
    document.getElementsByClassName("content")[5].style.display = "block"
    if (game.cosmicUpgradesUnlocked == true) document.getElementsByClassName("content")[7].style.display = "block"
  }
  else if (x==3) {
    document.getElementsByClassName("content")[8].style.display = "block"
  }
  else if (x==4) {
    document.getElementsByClassName("content")[1].style.display = "block"
  }
  else if (x==5) {
    document.getElementsByClassName("content")[0].style.display = "block"
    document.getElementsByClassName("content")[4].style.display = "block"
  }
}

function displayAchievement(x) {
  document.getElementById("achievementInfo").style.display = "block"
  document.getElementById("achievementName").innerHTML = achievementNames[x-1]
  document.getElementById("achievementNumber").innerHTML = romanNumerals[x-1]
  document.getElementById("achievementRequirement").innerHTML = format(achievementRequirements[x-1], 0)
}

function toColour(x) {
  if (x <= 50) {
    y = Math.floor(x / 50 * 255).toString(16)
    return "#ff" + (y.length < 2 ? '0' : '') + y + "00"
  }
  else if (x <= 100) {
    y = Math.floor((100 - x) / 50 * 255).toString(16)
    return "#" + (y.length < 2 ? '0' : '') + y + "ff00"
  }
  else if (x <= 1000) {
    y = Math.floor((x - 100) / 900 * 255).toString(16)
    return "#00ff" + (y.length < 2 ? '0' : '') + y
  }
  else if (x <= 100000) {
    y = Math.floor((x - 1000) / 99000 * 255).toString(16)
    return "#" + (y.length < 2 ? '0' : '') + y + "ffff"
  }
  else {return "#ffffff"}
}

function timePlayedUp() {
  game.timePlayed++
  timePlayedHours = Math.floor(game.timePlayed / 3600)
  timePlayedMinutes = Math.floor(game.timePlayed / 60) % 60
  timePlayedSeconds = game.timePlayed % 60
  timeString = (timePlayedHours + ":" + ((timePlayedMinutes < 10 ? '0' : '') + timePlayedMinutes) + ":" + ((timePlayedSeconds < 10 ? '0' : '') + timePlayedSeconds))
  document.getElementById("timePlayed").innerHTML = timeString
}

setInterval(timePlayedUp, 1000)