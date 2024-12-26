import { EquipmentSlot } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

export function weaponUpgrade(player, equippable) {
    const weapon = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
    const lore = weapon.getLore();

    const formData = new ActionFormData();
    formData.title('총기 개조').body(`들고 있는 총 : ${weapon.typeId.replace('fs:', '')}`);
    formData.button('총기 액세서리 부착');
    formData.button('총기 액세서리 분리');
    formData.show(player).then(response => {
        if (response.selection == 0) attachAccessory(player, weapon, lore);
        else if (response.selection == 1) removeAccessory(player, weapon, lore);
        else return;
    })
};

// 부착할 액세서리 선택
function attachAccessory(player, weapon, lore) {
    const formData = new ActionFormData();
    formData.title("액세서리 선택")
    .body(`현재 부착된 액세서리\n ${lore}`)
    .button("스코프")
    .button("사이트")
    .button("총열")
    .show(player)
    .then(response => {
        if (response.selection === 0) {
            if (lore.includes("scope")) player.sendMessage("이미 스코프가 부착되어 있습니다.");
            else {
                lore.push("scope")
                weapon.setLore(lore);
                player.sendMessage("스코프가 부착되었습니다.");
            }
        } else if (response.selection === 1) {
            if (lore.includes("sight")) player.sendMessage("이미 사이트가 부착되어 있습니다.");
            else {
                lore.push("sight")
                weapon.setLore(lore);
                player.sendMessage("사이트가 부착되었습니다.");
            }
        } else if (response.selection === 2) {
            if (lore.includes("barrel")) player.sendMessage("이미 총열이 부착되어 있습니다.");
            else {
                lore.push("barrel")
                weapon.setLore(lore);
                player.sendMessage("총열이 부착되었습니다.");
            }
        }
        else return;
    });
}

//제거할 액세서리 선택
function removeAccessory(player, weapon, lore) {
    const formData = new ActionFormData();
    formData.title("액세서리 선택")
    .body(`현재 부착된 액세서리\n ${lore}`)
    .button("스코프")
    .button("사이트")
    .button("총열")
    .button("전부 제거")
    .show(player)
    .then(response => {
        if (response.selection === 0) {
            if (lore.includes("scope")) {
                for(let i = 0; i < lore.length; i++) {
                    if(lore[i] === "scope") {
                    lore.splice(i, 1);
                    }
                }
                weapon.setLore(lore); // 스코프 제거
                player.sendMessage("스코프가 분리되었습니다.");
            }
            else player.sendMessage("이 총기에는 스코프가 부착되어 있지 않습니다.");
        }
        else if (response.selection === 1) {
            if (lore.includes("sight")) {
                for(let i = 0; i < lore.length; i++) {
                    if(lore[i] === "sight") {
                      lore.splice(i, 1);
                    }
                }
                weapon.setLore(lore); // 사이트 제거
                player.sendMessage("사이트가 분리되었습니다.");
            }
            else player.sendMessage("이 총기에는 사이트가 부착되어 있지 않습니다.");
        }
        else if (response.selection === 2) {
            if (lore.includes("barrel")) {
                for(let i = 0; i < lore.length; i++) {
                    if(lore[i] === "barrel") {
                      lore.splice(i, 1);
                    }
                }
                weapon.setLore(lore); // 총열 제거
                player.sendMessage("총열이 분리되었습니다.");
            }
            else player.sendMessage("이 총기에는 총열이 부착되어 있지 않습니다.");
        }
        else if (response.selection === 3) {
            weapon.setLore();
        }
        else return;
    });
}
