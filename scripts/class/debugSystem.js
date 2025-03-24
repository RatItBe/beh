import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { analyzeEquipmentSystem } from "class/analyzeEquipmentSystem"

export class DebugSystem {
    static selectMenu(player) {
        const form = new ActionFormData()
        .title("Debug")
        .body("테스트용 기능")
        .button("무기 감정하기", "textures/ui/icon_deals")
        .button("솥 전체 초기화", "textures/ui/hammer_l");

        form.show(player).then(response => {
            if (response.selection == 0) analyzeEquipmentSystem.equipmentCheck(player);
            else if (response.selection == 1) this.clearPotProperty(player);
            else return;
        });
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