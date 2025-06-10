import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { analyzeEquipmentSystem } from "class/analyzeEquipmentSystem"

export class DebugSystem {
    static selectMenu(player) {
        const form = new ActionFormData()
        .title("Debug")
        .body("테스트용 기능")
        .button("장비 로어 부여", "textures/ui/icon_recipe_equipment")
        .button("무기 감정", "textures/ui/hammer_l")
        .button("전체 방문자 확인", "textures/ui/icon_deals")
        .button("솥 전체 초기화", "textures/ui/mashup_world");

        form.show(player).then(response => {
            if (response.selection == 0) this.setEquipmentLore(player);
            else if (response.selection == 1) analyzeEquipmentSystem.equipmentCheck(player);
            else if (response.selection == 2) this.joinedPlayerList(player);
            else if (response.selection == 3) this.clearPotProperty(player);
            else return;
        });
    }

    static setEquipmentLore(player) {
        const equippable = player.getComponent("minecraft:equippable");
        const mainhand = equippable.getEquipment(EquipmentSlot.Mainhand);
        if (!mainhand) { // 손이 비어있다면
            player.sendMessage("아이템을 들고 있지 않습니다.");
            return;
        }

        const equipmentInfo = equipmentData[mainhand.typeId];
        if (!equipmentInfo) { // 손에 든 아이템이 감정할 수 있는 장비가 아니라면
            player.sendMessage("이 아이템은 감정할 수 없습니다.");
            return;
        }

        const item = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        let lore = item.getLore();
    }

    static joinedPlayerList(player) {
        let joinedPlayers = world.getDynamicProperty("joinedPlayers") || "";
        joinedPlayers = joinedPlayers.replaceAll(",", "\n");
        const form = new ActionFormData()
        .title("Debug")
        .body(joinedPlayers)
        .button("방문자 리스트 초기화");

        form.show(player).then(response => {
            if (response.selection == 0) {
                world.setDynamicProperty("joinedPlayers", "");
            }
            else return;
        })
    }

    static clearPotProperty(player) {
        const form = new ActionFormData()
        .title("Debug")
        .body("월드에 있는 모든 솥의 내용물을 초기화하시겠습니까?\nstate는 초기화되지 않습니다.\n(오류 발생 시에만 사용)")
        .button("예")
        .button("아니요");

        form.show(player).then(response => {
            if (response.selection == 0) {
                world.setDynamicProperty("cookingPot", "");
                world.setDynamicProperty("completePot", "");
                player.sendMessage("초기화되었습니다.");
            }
            else if (response.selection == 1) this.selectMenu(player);
            else return;
        });
    }
}