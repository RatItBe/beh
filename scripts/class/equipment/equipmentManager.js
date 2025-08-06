import { EquipmentSlot } from "@minecraft/server";
import { equipmentData } from "data/equipment";

export class EquipmentManager {
    // 장비의 typeId를 키로 받아 해당 장비의 데이터를 반환하는 메소드
    static getEquipmentData(key) {
        const playerEquipmentData = equipmentData[key];
        if (playerEquipmentData === undefined) return;        
        return playerEquipmentData;
    }

    static setEquipmentData() {

    }

    // 변경된 모든 데이터를 로어에 반영하는 메소드 (만약 item에 ContainerSlot 값을 넣는다면 slot 인자는 필요없음)
    static setLoreData(player, item, slot) {
        let lore = "§f";

        // 감정 횟수 작성
        const maximumAppraisalCount = item.getDynamicProperty("maximumAppraisalCount") || 0;
        if (maximumAppraisalCount) {
            const remainingAppraisalCount = item.getDynamicProperty("remainingAppraisalCount") || 0;
            lore += "감정 횟수 : " + remainingAppraisalCount + " / " + maximumAppraisalCount;
        }
        else lore += "아직 감정되지 않음";

        // 내구도 작성
        const maximumDurability = item.getDynamicProperty("maximumDurability");
        if (maximumDurability !== undefined) {
            const currentDurability = item.getDynamicProperty("currentDurability");
            if (maximumDurability !== undefined) {
                lore += " | 내구도 : " + currentDurability + " / " + maximumDurability;
            }
        }

        // 근거리 작성
        const meleeDamage = item.getDynamicProperty("meleeDamage");
        if (meleeDamage) {
            lore += "\n+" + meleeDamage + " 공격 피해";

            const meleeType = item.getDynamicProperty("meleeType") || "";
            if (meleeType === "slash") lore += " [참격] ";
            else if (meleeType === "strike") lore += " [타격] ";
            else if (meleeType === "pierce") lore += " [관통] ";
            else lore += " [무속성] ";

            const meleeCooldown = item.getDynamicProperty("meleeCooldown");
            if (meleeCooldown !== undefined) lore += meleeCooldown + "⌛";

            const criticalChance = item.getDynamicProperty("criticalChance");
            if (criticalChance !== undefined) lore += "\n" + criticalChance + "% 크리티컬 확률";
        }

        // 원거리 작성
        const rangedDamage = item.getDynamicProperty("rangedDamage");
        if (rangedDamage) {
            lore += "\n+" + rangedDamage + " 투사체 피해";

            const projectileAmount = item.getDynamicProperty("projectileAmount") || 0;
            if (projectileAmount > 1) lore += " × " + projectileAmount;

            const rangedType = item.getDynamicProperty("rangedType") || "";
            if (rangedType === "slash") lore += " [참격] ";
            else if (rangedType === "strike") lore += " [타격] ";
            else if (rangedType === "pierce") lore += " [관통] ";
            else lore += " [무속성] ";

            const rangedCooldown = item.getDynamicProperty("rangedCooldown");
            if (rangedCooldown !== undefined) lore += rangedCooldown + "⌛";

            const inaccuracyString = item.getDynamicProperty("inaccuracy");
            if (inaccuracyString) {
                try {
                    const inaccuracyObj = JSON.parse(inaccuracyString);
                    const defaultInaccuracy = inaccuracyObj.default;

                    if (typeof defaultInaccuracy === "number") {
                        lore += "\n명중률 : ";
                        if (defaultInaccuracy >= 0 && defaultInaccuracy < 20) lore += "5단계";
                        else if (defaultInaccuracy >= 20 && defaultInaccuracy < 40) lore += "4단계";
                        else if (defaultInaccuracy >= 40 && defaultInaccuracy < 60) lore += "3단계";
                        else if (defaultInaccuracy >= 60 && defaultInaccuracy < 80) lore += "2단계";
                        else if (defaultInaccuracy >= 80) lore += "1단계";
                        else lore += "?";
                    } else {
                        lore += "\n명중률 : ?";
                    }
                } catch (e) {
                    lore += "\n명중률 : ?";
                }
            }
            
            // 총기류 / 마법류 작성
            const maximumAmmo = item.getDynamicProperty("maximumAmmo");
            const manaCost = item.getDynamicProperty("manaCost");
            if (maximumAmmo) lore += "\n최대 탄알 수 : " + maximumAmmo + "발";
            else if (manaCost) lore += "\n마나 소비량 : 초당 " + manaCost;
        }

        // 부여된 능력 작성
        const grantedAbilityString = item.getDynamicProperty("grantedAbility") || "";
        if (grantedAbilityString) {
            lore += "\n";
            const grantedAbility = JSON.parse(grantedAbilityString);
            Object.entries(grantedAbility).forEach(([key, value]) => {
                lore += "\n" + key + " " + value;
            });
        }

        // 최종적으로 로어 반영
        item.setLore([lore]);
        // 로어가 작성된 아이템을 슬롯에 덮어씌움
        if (slot !== undefined) player.getComponent('inventory').container.setItem(slot, item);
    }

    // 장비 최초 제작 또는 습득 시 데이터를 아이템 내에 등록하는 메소드
    static registerEquipmentData(player, item) {
        // 장비 데이터 불러옴
        const key = item.typeId;
        const playerEquipmentData = this.getEquipmentData(key);
        if (!playerEquipmentData) {
            console.warn(`[오류] ${item.typeId} : 데이터를 등록하려고 했으나 데이터가 설정되어 있지 않음`);
            return;
        }

        // 장비 데이터를 하나씩 등록함, 이 때 데이터가 배열, 객체라면 문자열로 변환하여 등록
        Object.entries(playerEquipmentData).forEach(([key, value]) => {
            let sanitizedValue;

            if (typeof value === "object" && value !== null) {
                sanitizedValue = JSON.stringify(value); // 배열, 객체를 문자열로 변환
            } else {
                sanitizedValue = value; // 숫자, 문자열 등은 그대로 저장
            }
            item.setDynamicProperty(key, sanitizedValue);
        });

        // 몇가지 요소는 별도로 등록
        const maximumDurability = playerEquipmentData.maximumDurability;
        if (maximumDurability) item.setDynamicProperty("currentDurability", maximumDurability);
        const maximumAmmo = playerEquipmentData.maximumAmmo;
        if (maximumAmmo) item.setDynamicProperty("currentAmmo", maximumAmmo);
        item.setDynamicProperty("originalOwner", player.id);
    }

    // 장비가 최신 버전인지 확인하는 메소드, playerSpawn, playerInventoryItemChange 이벤트에서 실행
    static playerEquipmentCheck(player, item, slot) {
        const version = item.getDynamicProperty("version") || "";

        // 아이템 내에 버전이 있을 시(=기존에 존재하던 아이템일 시)
        if (version) {
            // 장비 데이터 불러옴
            const key = item.typeId;
            const playerEquipmentData = this.getEquipmentData(key);
            if (!playerEquipmentData) {
                console.warn(`[오류] ${item.typeId} : 데이터를 등록하려고 했으나 데이터가 설정되어 있지 않음`);
                return;
            }

            // 데이터 버전 불일치 시
            if (version !== playerEquipmentData.version) {
                // 장비에 최신 데이터 반영(새로 생긴건 추가, 없어진건 삭제, 기존값 덮어쓰기, 몇가지는 유지해야함)
                this.updatePlayerEquipment();

                // 감정 능력 읽어서 데이터 덮어쓰기
                this.

                // 갱신된 데이터를 로어로 작성
                this.setLoreData(player, item, slot);
            }
            return;
        }
        // 아이템 내에 버전이 없을 시(=최초 제작, 습득 상태일 시)
        else {
            // 아이템에 데이터 등록
            this.registerEquipmentData(player, item);

            // 등록된 데이터를 로어로 작성
            this.setLoreData(player, item, slot);
            return;
        }
    }

    // 감정할 장비인지 종합적으로 체크하는 메소드, DebugSystem 클래스에서 실행
    static appraisalCountCheck(player) {
        // 메인핸드에 아이템이 있는지 확인
        const equippable = player.getComponent("minecraft:equippable");
        const mainhandSlot = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        if (!mainhandSlot) {
            player.sendMessage("아이템을 들고 있지 않습니다.");
            return;
        }

        // 감정할 수 있는 장비인지 확인
        const availableAbility = mainhandSlot.getDynamicProperty("availableAbility") || "";
        if (!availableAbility) {
            player.sendMessage("이 아이템은 감정할 수 없습니다.");
            return;
        }

        // 이 아래부터 감정 횟수 불러오고 판별 시작
        const remainingAppraisalCount = mainhandSlot.getDynamicProperty("remainingAppraisalCount");

        // 감정 기회가 남아있을 시 실행될 코드 (감정 횟수 소모, 감정 실행)
        if (remainingAppraisalCount > 0) {
            // 감정 횟수 1회 소모
            mainhandSlot.setDynamicProperty("remainingAppraisalCount", remainingAppraisalCount - 1);

            // 감정 실행
            this.appraisalEquipment(player, mainhandSlot);

            // 감정 결과를 로어에 반영
            this.setLoreData(player, mainhandSlot);
            return;
        }
        // 감정 기회가 남아있지 않을 시 실행될 코드 (감정 불가 메시지 출력)
        else if (remainingAppraisalCount === 0) {
            player.sendMessage("이 아이템은 더 이상 감정할 수 없습니다.");
            return;
        }
        // 감정받은 적이 없을 시 실행될 코드 (최대 감정 횟수 부여, 감정 실행)
        else {
            // 정해진 확률에 따라 1~5번의 감정 기회 부여
            const chanceRoll = Math.random();
            let appraisalChance;
            if (chanceRoll < 0.1) appraisalChance = 1;
            else if (chanceRoll < 0.3) appraisalChance = 2;
            else if (chanceRoll < 0.7) appraisalChance = 3;
            else if (chanceRoll < 0.9) appraisalChance = 4;
            else appraisalChance = 5;
            mainhandSlot.setDynamicProperty("maximumAppraisalCount", appraisalChance);
            mainhandSlot.setDynamicProperty("remainingAppraisalCount", appraisalChance);

            // 감정 실행
            this.appraisalEquipment(player, mainhandSlot);

            // 감정 결과를 로어에 반영
            this.setLoreData(player, mainhandSlot);
            return;
        }
    }

    // 장비를 감정하고 능력을 부여하는 메소드
    static appraisalEquipment(player, mainhandSlot) {
        // 정해진 확률에 따라 0~2번의 기회가 주어짐
        const abilityRoll = Math.random();
        let abilityCount;
        // 20% 확률로 꽝, 즉시 종료
        if (abilityRoll < 0.2) {
            player.sendMessage("아무 능력도 부여되지 않았습니다.");
            return;
        }
        else if (abilityRoll < 0.7) abilityCount = 1;
        else abilityCount = 2;

        // 부여 가능한 능력 문자열을 불러와서 배열로 변환
        const availableAbilityString = mainhandSlot.getDynamicProperty("availableAbility") || "";
        const availableAbility = availableAbilityString ? JSON.parse(availableAbilityString) : [];

        // 이미 부여된 능력 문자열을 불러와서 객체로 변환
        const grantedAbilityString = mainhandSlot.getDynamicProperty("grantedAbility") || "";
        let grantedAbility = grantedAbilityString ? JSON.parse(grantedAbilityString) : {};

        // 기회만큼 랜덤으로 능력 부여
        for (let i = 0; i < abilityCount; i++) {
            const chosenAbility = availableAbility[Math.floor(Math.random() * availableAbility.length)];
            // 이미 부여된 능력일 시 레벨 1 증가
            if (chosenAbility in grantedAbility) {
                grantedAbility[chosenAbility] += 1;
            }
            // 처음 부여되는 능력일 시 기본값은 1레벨
            else {
                grantedAbility[chosenAbility] = 1;
            }
        }

        // 부여된 능력을 저장, 성공적으로 부여된 것을 메시지로 출력
        mainhandSlot.setDynamicProperty("grantedAbility", JSON.stringify(grantedAbility));
        player.sendMessage(`${abilityCount}개의 능력이 부여되었습니다.`);
        player.dimension.playSound("random.orb", player.location);
        return;
    }
}