import { system, world } from "@minecraft/server";

export function entityDie(eventData) {
    const entity = eventData.deadEntity;
    if (entity.typeId !== "minecraft:player") return; //플레이어만 아래 코드 실행
    const bleed = entity.getDynamicProperty("bleed") || false;
    if (!bleed) { //출혈 상태가 아닐 때 사망 시
        const location = entity.location;
        entity.playSound("block.bell.hit", {picth:1.1, volume:3})
        entity.setDynamicProperty("bleed", true);

        const armorStandCheck = system.runInterval(() => {
            const onlinePlayer = world.getAllPlayers().find(p => p.name === entity.name);// 플레이어가 여전히 온라인인지 확인
            if (!onlinePlayer) {
                system.clearRun(armorStandCheck);
                return;
            }

            const result = entity.addEffect("minecraft:invisibility", 20, {showParticles:false})
            entity.addEffect("minecraft:blindness", 20, {showParticles:false})
            if (result !== undefined) {
                entity.teleport(location);
                const spawnPointString = entity.getDynamicProperty("spawnPoint");
                const [dimensionId, x, y, z] = spawnPointString.split(",");
                console.warn([dimensionId, x, y, z])
                const spawnPoint = {
                    dimension: world.getDimension(dimensionId),
                    x: parseFloat(x),
                    y: parseFloat(y),
                    z: parseFloat(z)
                };
                entity.setSpawnPoint(spawnPoint);
                system.clearRun(armorStandCheck);
            }
        }, 2);
    }
    else { // 출혈 상태에서 사망 시
        const invDatabase = {};
        entity.setDynamicProperty("bleed", false);

        const playerinv = entity.getComponent("minecraft:inventory").container;
        const equipComp = entity.getComponent("minecraft:equippable");

        // 1. 아이템이 있는 슬롯 번호 찾기
        const slotNumbers = Array.from({ length: playerinv.size })
            .map((_, i) => (playerinv.getItem(i) ? i : undefined)) // 아이템이 있는 슬롯 번호
            .filter(i => i !== undefined); // null 제거

        // 2. keepOnDeath가 false인 아이템만 저장
        const nonKeepInvItems = slotNumbers
            .filter(slot => !playerinv.getSlot(slot).keepOnDeath) // keepOnDeath가 false인 슬롯 필터링
            .map(slot => ({
                slot,
                item: playerinv.getItem(slot) // 해당 슬롯의 아이템 저장
            }));

        // 3. 장비: 장비 슬롯 목록
        const equipmentSlots = ["Head", "Chest", "Legs", "Feet", "Offhand"];

        // 4. 장비: keepOnDeath가 false인 장비만 저장
        const nonKeepEquipItems = equipmentSlots
            .map(slot => ({
                slot,
                item: equipComp.getEquipment(slot) // 각 장비 슬롯의 아이템
            }))
            .filter(({ item }) => item && !item.keepOnDeath) // keepOnDeath가 false인 경우만 필터링

        // 5. 데이터베이스에 인벤토리 및 장비 저장
        invDatabase[entity.id] = {
            location: entity.location,
            dimension: entity.dimension.id,
            items: [
                ...nonKeepInvItems.map(({ item }) => item), // 인벤토리 아이템
                ...nonKeepEquipItems.map(({ item }) => item) // 장비 아이템
            ]
        };

        // 6. 인벤토리: 저장된 아이템 제거
        nonKeepInvItems.forEach(({ slot }) => playerinv.setItem(slot, undefined)); // 슬롯 비우기
        nonKeepEquipItems.forEach(({ slot }) => equipComp.setEquipment(slot, undefined)); // 장비 비우기

        // 7. 제거된 아이템 재소환
        invDatabase[entity.id]?.items.map((value) => world.getDimension(invDatabase[entity.id].dimension).spawnItem(value, invDatabase[entity.id].location))
    }
}