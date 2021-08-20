//LiteXLoader Dev Helper
///<reference path="c:\Users\MoorLinmo\.vscode\extensions\moxicat.lxldevhelper-0.1.4/Library/JS/Api.js" /> 
//By MoorLinmo blog.doreoom.com
//ver 1.1
//代码写得稀烂，吐了

var path = "plugins/CustomMonster/config.json";
var file = data.openConfig(path, 'json', '{}');
var nbt;
var jsonArray;

if (file.get("minecraft:zombie") == null) {
    var config = {};
    var Armors = {};
    var Armor = [];
    config.health = 20.0;
    config.absorption = 1;  //  0 16
    config.knockback_resistance = 1; //0.005209246184676886 1
    config.movement = 1;  // 0.3499999940395355 3.4028234663852886e+38
    config.underwater_movement = 1;  //0.019999999552965164  3.4028234663852886e+38
    config.lava_movement = 1;
    config.follow_range = 16; //16 2048
    config.attack_damage = 3; //3 3
    //装备
    Armors.Count = 0;
    Armors.Name = "";
    for (var i = 0; i < 4; i++) {
        Armor[i] = Armors;
    }
    config.Armor = Armor;
    file.set("minecraft:zombie", config);
}

mc.listen("onMobHurt", function (mob, source, damage) {
    if (mob.health > 0) {
        resetMob(mob, source, damage);
    }
})

//重置生物属性
function resetMob(mob, source, damage) {
    mobNbt = mob.getNbt();

    if (file.get(mob.name) != null) {
        //遍历json
        for (var key in file.get(mob.name)) {
            if(key == "Armor"){
                setArmor(mob, mobNbt);
                log(mobNbt.getTag("Armor").toString());
            }else if (getTagIndex(mobNbt, key) > -1) {
                setAttribute(mob, mobNbt, getTagIndex(mobNbt, key), file.get(mob.name)[key], damage);
            }
        }
    }
}

// //判断否有要改的属性
// function hasTag(mob, mobNbt, key, damage) {
//     if (getTagIndex(mobNbt, key) > -1) {
//         setAttribute(mob, mobNbt, getTagIndex(mobNbt, key), file.get(mob.name)[key], damage);
//     }
// }

//获得要修改的属性的下标
function getTagIndex(mobNbt, tagName) {
    var tagIndex = -1;
    for (var i = 0; i < mobNbt.getTag("Attributes").getSize(); i++) {
        if (mobNbt.getTag("Attributes").toArray()[i].Name.indexOf(tagName) > -1) {
            tagIndex = i;
            break;
        }
    }
    return tagIndex;
}

//设置属性
function setAttribute(mob, mobNbt, tagIndex, value, damage) {
    //判断是否修改过
    if (!mob.hasTag("is_" + mobNbt.getTag("Attributes").getTag(tagIndex).getTag("Name").toString())) {
        switch (mobNbt.getTag("Attributes").getTag(tagIndex).getTag("Name").toString()) {
            case "minecraft:health":
                mobNbt.getTag("Attributes").getTag(tagIndex).setFloat("Current", value - damage);
                break;
            case "minecraft:attack_damage":
                break;
            default:
                mobNbt.getTag("Attributes").getTag(tagIndex).setFloat("Current", value);
                break;
        }
        mobNbt.getTag("Attributes").getTag(tagIndex).setFloat("Base", value);
        mobNbt.getTag("Attributes").getTag(tagIndex).setFloat("DefaultMax", value);
        mobNbt.getTag("Attributes").getTag(tagIndex).setFloat("Max", value);
        //写入nbt
        mob.setNbt(mobNbt);
        //添加已修改的tag，
        mob.addTag("is_" + mobNbt.getTag("Attributes").getTag(tagIndex).getTag("Name").toString());
    }
}

function setArmor(mob, mobNbt){
    mobCt = mob.getArmor();
    if(!mob.hasTag("is_setArmor")){
        //清空物品捏
        mobCt.removeAllItems();
        for(var i=0; i<file.get(mob.name).Armor.length; i++){
            mobCt.addItemToFirstEmptySlot(mc.newItem(file.get(mob.name).Armor[i].Name, file.get(mob.name).Armor[i].Count));
        }
        
        mob.addTag("is_setArmor");
    }
}

// //遍历json
// for (var i in file.get("minecraft:zombie")) {
//     log(i + " " + file.get("minecraft:zombie")[i]);
// }

