import { EquipmentManager } from "class/equipment/equipmentManager"

export function playerInventoryItemChange(eventData) {
    const player = eventData.player;
    const item = eventData.itemStack;
    const slot = eventData.slot;

    EquipmentManager.playerEquipmentCheck(player, item, slot); // 인벤토리에 들어온 장비들이 최신 상태인지 체크
}
