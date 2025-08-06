import { system, EquipmentSlot } from "@minecraft/server";

export class WeaponSystem {
    // 근거리 공격, entityHitEntity에서 실행
    static meleeAttack(damagingEntity, hitEntity, mainhandSlot) {
        const playerMeleeCooldown = damagingEntity.getDynamicProperty("meleeCooldown") || 0;

        // 근거리 쿨타임이 0보다 크다면 즉시 종료
        if (playerMeleeCooldown > 0) return;

        const meleeDamage = mainhandSlot.getDynamicProperty("meleeDamage") || 0;

        // 근거리 데미지가 없다면 즉시 종료
        if (!meleeDamage) return;

        //데미지 부여, 근거리 공격 유형에 따른 데미지 연산 과정 필요
        hitEntity.applyDamage(meleeDamage, { cause : "override" });

        // 근거리 공격 소리 재생
        const meleeSoundString = mainhandSlot.getDynamicProperty("meleeSound") || "";
        let meleeSounds = [];
        try {
            const parsed = JSON.parse(meleeSoundString);
            meleeSounds = Array.isArray(parsed) ? parsed : [parsed]; // 배열 아니면 단일 객체도 배열로 감쌈
        } catch {
            meleeSounds = [];
        }
        meleeSounds.forEach(sound => {
            if (!sound.soundName) return;

            const soundLocation = {
                x: damagingEntity.location.x,
                y: damagingEntity.location.y + 0.5,
                z: damagingEntity.location.z
            };

            damagingEntity.dimension.playSound(sound.soundName, soundLocation, {
                pitch: sound.pitch ?? 1.0,
                volume: sound.volume ?? 1.0,
            });
        });

        // 근거리 공격 쿨타임 부여
        const itemMeleeCooldown = mainhandSlot.getDynamicProperty("meleeCooldown") || 0;
        damagingEntity.setDynamicProperty("meleeCooldown", Math.round(itemMeleeCooldown * 10));
    }

    // 근거리 쿨타임 체크, runInterval2에서 실행(1초당 10번 실행)
    static meleeCooldownCheck(player) {
        const playerMeleeCooldown = player.getDynamicProperty("meleeCooldown") || 0; // 근접 쿨타임 불러오기
        if (playerMeleeCooldown > 0) { // 현재 근접 쿨타임이 남아있다면
            player.setDynamicProperty("meleeCooldown", playerMeleeCooldown - 1); // 근접 쿨타임 감소
            // Map 객체를 이용한 개별 플레이어 쿨타임 연산도 고려중
        }
    }
    
    // 원거리 공격, itemReleaseUse 및 itemUse에서 실행
    static rangedAttack(player, mainhandSlot, cost) {
        // 투사체 개수가 1개 이상인지 체크 (미설정 시 1개로 설정)
        const projectileAmount = mainhandSlot.getDynamicProperty("projectileAmount") || 1;

        // 투사체 개수만큼 탄약 소모 및 점사 실행
        system.run(() => {
            for (let i = 0; i < projectileAmount; i++) {
                // 일반 총기류일 시 잔여 탄약값 소모
                if (cost.currentAmmo !== undefined) {
                    mainhandSlot.setDynamicProperty("currentAmmo", cost.currentAmmo - 1);
                    //const ammoScoreboard = world.scoreboard.getObjective("ammo").getScore(player.scoreboardIdentity);
                    //player.runCommand(`scoreboard players remove @s bullet 1`);
                }
                // 마법류일 시 코드, 보류
                else if (cost.manaCost !== undefined) {
//const costMana = mainhandSlot.getDynamicProperty("costMana");
            /*else if (costMana !== undefined) { // 마나 소모값이 존재할 시(=마법류일 시)
                const manaScoreboard = world.scoreboard.getObjective("mana");
                if (manaScoreboard) {
                    const playerMana = manaScoreboard.getScore(player.scoreboardIdentity) ?? 0;
                    if (playerMana)
                    player.runCommand(`scoreboard players remove @s ${SHOP_CONFIG.MONEY_OBJECTIVE} ${totalPrice}`);
                }
            }*/
                }
                // 기관총류일 시 탄약낭 내구도 감소
                else if (cost.ammoBackpack !== undefined) {
                    // 플레이어가 앉아있지 않을 시 즉시 종료
                    if (!player.isSneaking) break;

                    const equippable = player.getComponent("minecraft:equippable");
                    const offhand = equippable.getEquipment(EquipmentSlot.Offhand);
                    
                    // 왼손이 비어있을 시 즉시 종료
                    if (!offhand) break;

                    // 왼손이 탄약낭이 아닐 시 즉시 종료
                    if (offhand.typeId !== cost.ammoBackpack) break;

                    const durability = offhand.getComponent("minecraft:durability");
                    
                    // 탄약낭 내구도가 충분할 시 내구도 감소
                    if (durability.damage < durability.maxDurability) {
                        durability.damage++;
                        const offhandSlot = equippable.getEquipmentSlot(EquipmentSlot.Offhand);
                        offhandSlot.setItem(offhand);
                    }
                    // 탄약낭 내구도가 불충분할 시 탄약 부족할 때 나는 소리 재생 및 즉시 종료
                    else {
                        player.dimension.playSound("tile.piston.in", player.location);
                        break;
                    }
                }
                // 3종류에 해당되지 않을 시 오류 처리
                else {
                    console.warn(`[오류] ${mainhandSlot.typeId} : 발사하려고 했으나 소모값이 설정되어 있지 않음`);
                    return;
                }

                const projectileBurstDelay = mainhandSlot.getDynamicProperty("projectileBurstDelay") || 0;
                
                // 투사체 발사 실행
                system.runTimeout(() => {
                    // 명중률 계산
                    const viewDirection = player.getViewDirection();
                    const inaccuracyString = mainhandSlot.getDynamicProperty("inaccuracy") || "";
                    const inaccuracy = inaccuracyString ? JSON.parse(inaccuracyString) : {};
                    if (!inaccuracy) return;
                    let spreadAngle = 0;
                    if (!player.isSneaking) spreadAngle += inaccuracy.sneaking;
                    if (!player.isOnGround) spreadAngle += inaccuracy.jumping;
                    else if (player.inputInfo.getMovementVector().x || 
                    player.inputInfo.getMovementVector().y) spreadAngle += inaccuracy.moving;
                    const offsetX = viewDirection.x + Math.random() * spreadAngle / 100 - spreadAngle / 200;
                    const offsetY = viewDirection.y + Math.random() * spreadAngle / 100 - spreadAngle / 200;
                    const offsetZ = viewDirection.z + Math.random() * spreadAngle / 100 - spreadAngle / 200;

                    // 투사체 속도
                    const projectileSpeed = mainhandSlot.getDynamicProperty("projectileSpeed") || 10;

                    // 투사체 생성
                    const spawnPos = {
                        x: player.location.x + viewDirection.x,
                        y: player.location.y + viewDirection.y + 1.25,
                        z: player.location.z + viewDirection.z,
                    };
                    const projectileTypeId = mainhandSlot.getDynamicProperty("projectileTypeId") || "fs:r306_bullet";
                    const projectile = player.dimension.spawnEntity(projectileTypeId, spawnPos);

                    const rangedDamage = mainhandSlot.getDynamicProperty("rangedDamage") || 0;
                    projectile.setDynamicProperty("rangedDamage", rangedDamage);

                    const projectileComponent = projectile.getComponent("minecraft:projectile");
                    projectileComponent.owner = player;

                    // 투사체 발사
                    projectileComponent.shoot({
                        x: offsetX * projectileSpeed,
                        y: offsetY * projectileSpeed,
                        z: offsetZ * projectileSpeed,
                    },{uncertainty: spreadAngle});

                    // 발사 소리 재생
                    const rangedSoundString = mainhandSlot.getDynamicProperty("rangedSound") || "";
                    let rangedSounds = [];
                    try {
                        const parsed = JSON.parse(rangedSoundString);
                        rangedSounds = Array.isArray(parsed) ? parsed : [parsed]; // 배열 아니면 단일 객체도 배열로 감쌈
                    } catch {
                        rangedSounds = [];
                    }
                    rangedSounds.forEach(sound => {
                        if (!sound.soundName) return;

                        const soundLocation = {
                            x: player.location.x + viewDirection.x,
                            y: player.location.y + viewDirection.y + 0.5,
                            z: player.location.z + viewDirection.z,
                        };

                        player.dimension.playSound(sound.soundName, soundLocation, {
                            pitch: sound.pitch ?? 1.0,
                            volume: sound.volume ?? 1.0,
                        });
                    });

                    // 카메라 흔들림으로 반동 구현
                    player.runCommand("camerashake add @s 0.2 0.05 rotational");
                }, projectileBurstDelay * i);
            }
        });
    }

    // 일반 총기류 아이템 장전, itemReleaseUse에서 실행
    // (코드는 100% 완성했으나 웅크리고 좌클릭 시에도 장전될 수 있도록 해보는 것도 괜찮을 듯)
    static reloadWeapon(player, mainhandSlot, useDuration) {
        // 장전에 필요한 시간만큼 우클릭하고 있었는지 체크(왜 이런 코드인지는 이 파일 맨아래에서 설명)   
        if (useDuration > 200000) {
            const soundLocation = {
                x: player.location.x,
                y: player.location.y + 0.5,
                z: player.location.z
            };
            player.dimension.playSound("tile.piston.in", soundLocation, {pitch: 1.8, volume:0.5});
            return;
        }

        const reloadItem = mainhandSlot.getDynamicProperty("reloadItem")

        // 장전에 필요한 아이템 데이터가 있는지 체크
        if (reloadItem === undefined) {
            console.warn(`[오류] ${mainhandSlot.typeId} : 장전하려고 했으나 장전에 필요한 아이템이 설정되어 있지 않음`);
            return;
        }

        // 장전에 필요한 아이템 보유 여부 체크
        const ammoExist = player.runCommand(`clear @s ${reloadItem} 0 0`).successCount
        if (!ammoExist) return;

        // 아이템에 저장된 최대 탄 수 데이터 체크(장전 탄 수에 필요)
        const maximumAmmo = mainhandSlot.getDynamicProperty("maximumAmmo");
        if (maximumAmmo === undefined) {
            console.warn(`[오류] ${mainhandSlot.typeId} : 장전하려고 했으나 무기의 최대 탄 수 데이터가 설정되어 있지 않음`);
            return;
        }

        // 장전 완료, 장전에 필요한 아이템 소모 및 장전 소리 재생
        mainhandSlot.setDynamicProperty("currentAmmo", maximumAmmo);
        player.runCommand(`clear @s ${reloadItem} 0 1`);
        player.runCommand("playsound tile.piston.in @s ~~~ 0.5 1.8 0.2");
    }

    // 투사체 피격 시 계산하고 데미지 부여, projectileHitEntity에서 실행
    static projectileHit(entity, rangedDamage) {
        entity.applyDamage(rangedDamage, { cause : "override" });
        return;
    }
}

/** if (useDuration > 200000) return;
 * 왜 useDuration이 200000보다 작아야 장전 성공으로 판정하는가?
 * 우선 총기 아이템의 duration 컴포넌트를 10000 + n 으로 설정해야 함
 * 이 때 n은 장전에 필요한 시간(초)라고 생각하면 됨
 * 예를 들어 r306을 장전하는 데 5초가 걸리게 하고 싶다면 duration을 10005로 설정해주면 됨
 * 
 * 이제 useDuration이 정해지는 공식을 보자
 * useDuration = 아이템에 설정된 duration 컴포넌트값 * 20(틱) - 아이템을 우클릭하고 있던 시간 * 20(틱)
 * 따라서 예시의 r306은 useDuration의 초기값은 10005 * 20 = 200100 으로 설정될 거고
 * r306을 들고 5초동안 우클릭을 했다면 200100 - 5 * 20 = 200000 이 됨
 * 따라서 useDuration <= 200000 으로 판정되고 장전에 성공하게 됨
*/