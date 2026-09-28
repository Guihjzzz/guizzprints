/*
 * Bedrock -> Java block-state mapping engine derived from @taku128/core 0.4.0.
 * Copyright Taku128 and contributors. MIT License.
 * Source: https://github.com/Taku128/mc-nbt-converter
 * Only mapping exports are exposed; Guizz keeps its own lossless two-layer
 * mcstructure parser because the upstream mcstructure wrapper reads layer 0.
 */

// data/chunker-mappings.json
var chunker_mappings_default = {
  names: {
    "minecraft:brick_block": "minecraft:bricks",
    "minecraft:web": "minecraft:cobweb",
    "minecraft:powered_comparator": "minecraft:comparator",
    "minecraft:unpowered_comparator": "minecraft:comparator",
    "minecraft:yellow_flower": "minecraft:dandelion",
    "minecraft:daylight_detector_inverted": "minecraft:daylight_detector",
    "minecraft:deadbush": "minecraft:dead_bush",
    "minecraft:grass_path": "minecraft:dirt_path",
    "minecraft:end_bricks": "minecraft:end_stone_bricks",
    "minecraft:stonecutter_block": "minecraft:stonecutter",
    "minecraft:waterlily": "minecraft:lily_pad",
    "minecraft:standing_banner": "minecraft:white_banner",
    "minecraft:wall_banner": "minecraft:white_wall_banner",
    "minecraft:bed": "minecraft:white_bed",
    "minecraft:magma": "minecraft:magma_block",
    "minecraft:melon_block": "minecraft:melon",
    "minecraft:nether_brick": "minecraft:nether_bricks",
    "minecraft:portal": "minecraft:nether_portal",
    "minecraft:quartz_ore": "minecraft:nether_quartz_ore",
    "minecraft:noteblock": "minecraft:note_block",
    "minecraft:skull": "minecraft:skeleton_wall_skull",
    "minecraft:red_nether_brick": "minecraft:red_nether_bricks",
    "minecraft:slime": "minecraft:slime_block",
    "minecraft:mob_spawner": "minecraft:spawner",
    "minecraft:hardened_clay": "minecraft:terracotta",
    "minecraft:lit_redstone_lamp": "minecraft:redstone_lamp",
    "minecraft:lit_redstone_ore": "minecraft:redstone_ore",
    "minecraft:unlit_redstone_torch": "minecraft:redstone_wall_torch",
    "minecraft:redstone_torch": "minecraft:redstone_wall_torch",
    "minecraft:torch": "minecraft:wall_torch",
    "minecraft:powered_repeater": "minecraft:repeater",
    "minecraft:unpowered_repeater": "minecraft:repeater",
    "minecraft:snow_layer": "minecraft:snow",
    "minecraft:snow": "minecraft:snow_block",
    "minecraft:frame": "minecraft:item_frame_bedrock",
    "minecraft:undyed_shulker_box": "minecraft:shulker_box",
    "minecraft:pistonarmcollision": "minecraft:piston_head",
    "minecraft:wooden_slab": "minecraft:oak_slab",
    "minecraft:double_wooden_slab": "minecraft:oak_slab",
    "minecraft:sealantern": "minecraft:sea_lantern",
    "minecraft:movingblock": "minecraft:moving_block_bedrock",
    "minecraft:invisiblebedrock": "minecraft:invisible_bedrock",
    "minecraft:stickypistonarmcollision": "minecraft:piston_head",
    "minecraft:light_block": "minecraft:light",
    "minecraft:blackstone_double_slab": "minecraft:blackstone_slab",
    "minecraft:chain": "minecraft:iron_chain",
    "minecraft:crimson_double_slab": "minecraft:crimson_slab",
    "minecraft:lodestone_block": "minecraft:lodestone",
    "minecraft:polished_blackstone_brick_double_slab": "minecraft:polished_blackstone_brick_slab",
    "minecraft:polished_blackstone_double_slab": "minecraft:polished_blackstone_slab",
    "minecraft:warped_double_slab": "minecraft:warped_slab",
    "minecraft:twisting_vines_block": "minecraft:twisting_vines",
    "minecraft:soul_torch": "minecraft:soul_wall_torch",
    "minecraft:cave_vines_head_with_berries": "minecraft:cave_vines_head",
    "minecraft:cave_vines": "minecraft:cave_vines_head",
    "minecraft:cave_vines_body_with_berries": "minecraft:cave_vines_body",
    "minecraft:cobbled_deepslate_double_slab": "minecraft:cobbled_deepslate_slab",
    "minecraft:double_cut_copper_slab": "minecraft:cut_copper_slab",
    "minecraft:deepslate_brick_double_slab": "minecraft:deepslate_brick_slab",
    "minecraft:lit_deepslate_redstone_ore": "minecraft:deepslate_redstone_ore",
    "minecraft:deepslate_tile_double_slab": "minecraft:deepslate_tile_slab",
    "minecraft:exposed_double_cut_copper_slab": "minecraft:exposed_cut_copper_slab",
    "minecraft:oxidized_double_cut_copper_slab": "minecraft:oxidized_cut_copper_slab",
    "minecraft:polished_deepslate_double_slab": "minecraft:polished_deepslate_slab",
    "minecraft:dirt_with_roots": "minecraft:rooted_dirt",
    "minecraft:small_dripleaf_block": "minecraft:small_dripleaf",
    "minecraft:waxed_copper": "minecraft:waxed_copper_block",
    "minecraft:waxed_double_cut_copper_slab": "minecraft:waxed_cut_copper_slab",
    "minecraft:waxed_exposed_double_cut_copper_slab": "minecraft:waxed_exposed_cut_copper_slab",
    "minecraft:waxed_oxidized_double_cut_copper_slab": "minecraft:waxed_oxidized_cut_copper_slab",
    "minecraft:waxed_weathered_double_cut_copper_slab": "minecraft:waxed_weathered_cut_copper_slab",
    "minecraft:weathered_double_cut_copper_slab": "minecraft:weathered_cut_copper_slab",
    "minecraft:glow_frame": "minecraft:item_frame_bedrock",
    "minecraft:frog_egg": "minecraft:frogspawn",
    "minecraft:sticky_piston_arm_collision": "minecraft:piston_head",
    "minecraft:piston_arm_collision": "minecraft:piston_head",
    "minecraft:trip_wire": "minecraft:tripwire",
    "minecraft:moving_block": "minecraft:moving_block_bedrock",
    "minecraft:frog_spawn": "minecraft:frogspawn",
    "minecraft:mud_brick_double_slab": "minecraft:mud_brick_slab",
    "minecraft:mangrove_propagule_hanging": "minecraft:mangrove_propagule",
    "minecraft:mangrove_standing_sign": "minecraft:mangrove_sign",
    "minecraft:mangrove_double_slab": "minecraft:mangrove_slab",
    "minecraft:bamboo_mosaic_double_slab": "minecraft:bamboo_mosaic_slab",
    "minecraft:bamboo_standing_sign": "minecraft:bamboo_sign",
    "minecraft:bamboo_double_slab": "minecraft:bamboo_slab",
    "minecraft:cherry_standing_sign": "minecraft:cherry_sign",
    "minecraft:cherry_double_slab": "minecraft:cherry_slab",
    "minecraft:polished_tuff_double_slab": "minecraft:polished_tuff_slab",
    "minecraft:tuff_brick_double_slab": "minecraft:tuff_brick_slab",
    "minecraft:tuff_double_slab": "minecraft:tuff_slab",
    "minecraft:oak_slab": "minecraft:petrified_oak_slab",
    "minecraft:oak_double_slab": "minecraft:petrified_oak_slab",
    "minecraft:light_block_0": "minecraft:light",
    "minecraft:deprecated_anvil": "minecraft:damaged_anvil",
    "minecraft:underwater_tnt": "minecraft:tnt",
    "minecraft:deprecated_purpur_block_1": "minecraft:purpur_block",
    "minecraft:deprecated_purpur_block_2": "minecraft:purpur_block",
    "minecraft:pale_oak_double_slab": "minecraft:pale_oak_slab",
    "minecraft:pale_oak_standing_sign": "minecraft:pale_oak_sign",
    "minecraft:resin_brick_double_slab": "minecraft:resin_brick_slab",
    "minecraft:copper_torch": "minecraft:copper_wall_torch",
    "minecraft:pumpkin_stem": "minecraft:attached_pumpkin_stem",
    "minecraft:melon_stem": "minecraft:attached_melon_stem",
    "minecraft:golden_rail": "minecraft:powered_rail",
    "minecraft:fence_gate": "minecraft:oak_fence_gate",
    "minecraft:wooden_door": "minecraft:oak_door",
    "minecraft:birch_standing_sign": "minecraft:birch_sign",
    "minecraft:acacia_standing_sign": "minecraft:acacia_sign",
    "minecraft:spruce_standing_sign": "minecraft:spruce_sign",
    "minecraft:jungle_standing_sign": "minecraft:jungle_sign",
    "minecraft:darkoak_standing_sign": "minecraft:dark_oak_sign",
    "minecraft:standing_sign": "minecraft:oak_sign",
    "minecraft:trapdoor": "minecraft:oak_trapdoor",
    "minecraft:lit_pumpkin": "minecraft:jack_o_lantern",
    "minecraft:lit_smoker": "minecraft:smoker",
    "minecraft:lit_furnace": "minecraft:furnace",
    "minecraft:lit_blast_furnace": "minecraft:blast_furnace",
    "minecraft:wooden_button": "minecraft:oak_button",
    "minecraft:wooden_pressure_plate": "minecraft:oak_pressure_plate",
    "minecraft:beetroot": "minecraft:beetroots",
    "minecraft:wall_sign": "minecraft:oak_wall_sign",
    "minecraft:darkoak_wall_sign": "minecraft:dark_oak_wall_sign",
    "minecraft:silver_glazed_terracotta": "minecraft:light_gray_glazed_terracotta",
    "minecraft:grass": "minecraft:grass_block",
    "minecraft:reeds": "minecraft:sugar_cane",
    "minecraft:prismarine_bricks_stairs": "minecraft:prismarine_brick_stairs",
    "minecraft:stone_stairs": "minecraft:cobblestone_stairs",
    "minecraft:normal_stone_stairs": "minecraft:stone_stairs",
    "minecraft:end_brick_stairs": "minecraft:end_stone_brick_stairs",
    "minecraft:flowing_water": "minecraft:water",
    "minecraft:flowing_lava": "minecraft:lava",
    "minecraft:crimson_standing_sign": "minecraft:crimson_sign",
    "minecraft:warped_standing_sign": "minecraft:warped_sign",
    "minecraft:azalea_leaves_flowered": "minecraft:flowering_azalea_leaves",
    "minecraft:oak_hanging_sign": "minecraft:oak_wall_hanging_sign",
    "minecraft:crimson_hanging_sign": "minecraft:crimson_wall_hanging_sign",
    "minecraft:birch_hanging_sign": "minecraft:birch_wall_hanging_sign",
    "minecraft:dark_oak_hanging_sign": "minecraft:dark_oak_wall_hanging_sign",
    "minecraft:acacia_hanging_sign": "minecraft:acacia_wall_hanging_sign",
    "minecraft:spruce_hanging_sign": "minecraft:spruce_wall_hanging_sign",
    "minecraft:warped_hanging_sign": "minecraft:warped_wall_hanging_sign",
    "minecraft:jungle_hanging_sign": "minecraft:jungle_wall_hanging_sign",
    "minecraft:mangrove_hanging_sign": "minecraft:mangrove_wall_hanging_sign",
    "minecraft:bamboo_hanging_sign": "minecraft:bamboo_wall_hanging_sign",
    "minecraft:jungle_double_slab": "minecraft:jungle_slab",
    "minecraft:acacia_double_slab": "minecraft:acacia_slab",
    "minecraft:spruce_double_slab": "minecraft:spruce_slab",
    "minecraft:dark_oak_double_slab": "minecraft:dark_oak_slab",
    "minecraft:birch_double_slab": "minecraft:birch_slab",
    "minecraft:brick_double_slab": "minecraft:brick_slab",
    "minecraft:smooth_stone_double_slab": "minecraft:smooth_stone_slab",
    "minecraft:nether_brick_double_slab": "minecraft:nether_brick_slab",
    "minecraft:sandstone_double_slab": "minecraft:sandstone_slab",
    "minecraft:stone_brick_double_slab": "minecraft:stone_brick_slab",
    "minecraft:cobblestone_double_slab": "minecraft:cobblestone_slab",
    "minecraft:quartz_double_slab": "minecraft:quartz_slab",
    "minecraft:petrified_oak_double_slab": "minecraft:petrified_oak_slab",
    "minecraft:red_sandstone_double_slab": "minecraft:red_sandstone_slab",
    "minecraft:purpur_double_slab": "minecraft:purpur_slab",
    "minecraft:prismarine_double_slab": "minecraft:prismarine_slab",
    "minecraft:dark_prismarine_double_slab": "minecraft:dark_prismarine_slab",
    "minecraft:prismarine_brick_double_slab": "minecraft:prismarine_brick_slab",
    "minecraft:mossy_cobblestone_double_slab": "minecraft:mossy_cobblestone_slab",
    "minecraft:smooth_sandstone_double_slab": "minecraft:smooth_sandstone_slab",
    "minecraft:red_nether_brick_double_slab": "minecraft:red_nether_brick_slab",
    "minecraft:end_stone_brick_double_slab": "minecraft:end_stone_brick_slab",
    "minecraft:smooth_red_sandstone_double_slab": "minecraft:smooth_red_sandstone_slab",
    "minecraft:polished_andesite_double_slab": "minecraft:polished_andesite_slab",
    "minecraft:andesite_double_slab": "minecraft:andesite_slab",
    "minecraft:diorite_double_slab": "minecraft:diorite_slab",
    "minecraft:polished_diorite_double_slab": "minecraft:polished_diorite_slab",
    "minecraft:granite_double_slab": "minecraft:granite_slab",
    "minecraft:polished_granite_double_slab": "minecraft:polished_granite_slab",
    "minecraft:normal_stone_slab": "minecraft:stone_slab",
    "minecraft:mossy_stone_brick_double_slab": "minecraft:mossy_stone_brick_slab",
    "minecraft:smooth_quartz_double_slab": "minecraft:smooth_quartz_slab",
    "minecraft:normal_stone_double_slab": "minecraft:stone_slab",
    "minecraft:cut_sandstone_double_slab": "minecraft:cut_sandstone_slab",
    "minecraft:cut_red_sandstone_double_slab": "minecraft:cut_red_sandstone_slab",
    "minecraft:skeleton_skull": "minecraft:skeleton_wall_skull",
    "minecraft:zombie_head": "minecraft:zombie_wall_head",
    "minecraft:player_head": "minecraft:player_wall_head",
    "minecraft:creeper_head": "minecraft:creeper_wall_head",
    "minecraft:wither_skeleton_skull": "minecraft:wither_skeleton_wall_skull",
    "minecraft:dragon_head": "minecraft:dragon_wall_head",
    "minecraft:piglin_head": "minecraft:piglin_wall_head"
  },
  flatten: {
    "minecraft:anvil": {
      damage: {
        broken: "minecraft:damaged_anvil",
        undamaged: "minecraft:anvil",
        slightly_damaged: "minecraft:chipped_anvil",
        very_damaged: "minecraft:damaged_anvil"
      }
    },
    "minecraft:cauldron": {
      fill_level: {
        "0": "minecraft:cauldron"
      },
      cauldron_liquid: {
        water: "minecraft:water_cauldron",
        lava: "minecraft:lava_cauldron",
        powder_snow: "minecraft:powder_snow_cauldron"
      }
    },
    "minecraft:lava_cauldron": {
      fill_level: {
        "0": "minecraft:cauldron"
      }
    },
    "minecraft:kelp": {
      age: {
        "15": "minecraft:kelp_plant"
      },
      kelp_age: {
        "25": "minecraft:kelp_plant"
      }
    },
    "minecraft:stonebrick": {
      stone_brick_type: {
        smooth: "minecraft:stone_bricks",
        default: "minecraft:stone_bricks",
        mossy: "minecraft:mossy_stone_bricks",
        cracked: "minecraft:cracked_stone_bricks",
        chiseled: "minecraft:chiseled_stone_bricks"
      }
    },
    "minecraft:coral_fan_hang3": {
      dead_bit: {
        false: "minecraft:horn_coral_wall_fan",
        true: "minecraft:dead_horn_coral_wall_fan"
      }
    },
    "minecraft:brown_mushroom_block": {
      huge_mushroom_bits: {
        "10": "minecraft:mushroom_stem",
        "15": "minecraft:mushroom_stem"
      }
    },
    "minecraft:red_mushroom_block": {
      huge_mushroom_bits: {
        "10": "minecraft:mushroom_stem",
        "15": "minecraft:mushroom_stem"
      }
    },
    "minecraft:skull": {
      facing_direction: {
        "1": "minecraft:skeleton_skull"
      }
    },
    "minecraft:tallgrass": {
      tall_grass_type: {
        tall: "minecraft:short_grass",
        default: "minecraft:short_grass",
        fern: "minecraft:fern",
        snow: "minecraft:fern"
      }
    },
    "minecraft:pumpkin": {
      direction: {
        "0": "minecraft:pumpkin"
      }
    },
    "minecraft:quartz_block": {
      chisel_type: {
        chiseled: "minecraft:chiseled_quartz_block",
        smooth: "minecraft:smooth_quartz"
      },
      pillar_axis: {
        y: "minecraft:quartz_block"
      }
    },
    "minecraft:unlit_redstone_torch": {
      torch_facing_direction: {
        top: "minecraft:redstone_torch",
        unknown: "minecraft:redstone_torch"
      }
    },
    "minecraft:redstone_torch": {
      torch_facing_direction: {
        top: "minecraft:redstone_torch",
        unknown: "minecraft:redstone_torch"
      }
    },
    "minecraft:torch": {
      torch_facing_direction: {
        top: "minecraft:torch",
        unknown: "minecraft:torch"
      }
    },
    "minecraft:snow_layer": {
      covered_bit: {
        false: "minecraft:snow"
      }
    },
    "minecraft:seagrass": {
      sea_grass_type: {
        double_bot: "minecraft:tall_seagrass",
        double_top: "minecraft:tall_seagrass",
        default: "minecraft:seagrass"
      }
    },
    "minecraft:weeping_vines": {
      weeping_vines_age: {
        "25": "minecraft:weeping_vines_plant"
      }
    },
    "minecraft:twisting_vines": {
      twisting_vines_age: {
        "25": "minecraft:twisting_vines_plant"
      }
    },
    "minecraft:twisting_vines_block": {
      twisting_vines_age: {
        "25": "minecraft:twisting_vines_plant"
      }
    },
    "minecraft:soul_torch": {
      torch_facing_direction: {
        top: "minecraft:soul_torch",
        unknown: "minecraft:soul_torch"
      }
    },
    "minecraft:big_dripleaf": {
      big_dripleaf_head: {
        true: "minecraft:big_dripleaf",
        false: "minecraft:big_dripleaf_stem"
      }
    },
    "minecraft:cave_vines": {
      growing_plant_age: {
        "25": "minecraft:cave_vines_body"
      }
    },
    "minecraft:mangrove_propagule": {
      hanging: {
        false: "minecraft:mangrove_propagule",
        true: "minecraft:mangrove_propagule"
      }
    },
    "minecraft:mangrove_wood": {
      stripped_bit: {
        false: "minecraft:mangrove_wood",
        true: "minecraft:stripped_mangrove_wood"
      }
    },
    "minecraft:cherry_wood": {
      stripped_bit: {
        false: "minecraft:cherry_wood",
        true: "minecraft:stripped_cherry_wood"
      }
    },
    "minecraft:cherry_hanging_sign": {
      hanging: {
        false: "minecraft:cherry_wall_hanging_sign",
        true: "minecraft:cherry_hanging_sign"
      }
    },
    "minecraft:chiseled_quartz_block": {
      pillar_axis: {
        y: "minecraft:chiseled_quartz_block"
      }
    },
    "minecraft:smooth_quartz": {
      pillar_axis: {
        y: "minecraft:smooth_quartz"
      }
    },
    "minecraft:purpur_block": {
      pillar_axis: {
        y: "minecraft:purpur_block"
      }
    },
    "minecraft:mushroom_stem": {
      huge_mushroom_bits: {
        "10": "minecraft:mushroom_stem",
        "15": "minecraft:mushroom_stem"
      }
    },
    "minecraft:pale_oak_hanging_sign": {
      hanging: {
        false: "minecraft:pale_oak_wall_hanging_sign",
        true: "minecraft:pale_oak_hanging_sign"
      }
    },
    "minecraft:copper_torch": {
      torch_facing_direction: {
        top: "minecraft:copper_torch",
        unknown: "minecraft:copper_torch"
      }
    },
    "minecraft:leaves2": {
      new_leaf_type: {
        dark_oak: "minecraft:dark_oak_leaves",
        acacia: "minecraft:acacia_leaves"
      }
    },
    "minecraft:dirt": {
      dirt_type: {
        coarse: "minecraft:coarse_dirt",
        normal: "minecraft:dirt"
      }
    },
    "minecraft:sapling": {
      sapling_type: {
        oak: "minecraft:oak_sapling",
        spruce: "minecraft:spruce_sapling",
        birch: "minecraft:birch_sapling",
        dark_oak: "minecraft:dark_oak_sapling",
        acacia: "minecraft:acacia_sapling",
        jungle: "minecraft:jungle_sapling"
      }
    },
    "minecraft:monster_egg": {
      monster_egg_stone_type: {
        mossy_stone_brick: "minecraft:infested_mossy_stone_bricks",
        cobblestone: "minecraft:infested_cobblestone",
        stone: "minecraft:infested_stone",
        stone_brick: "minecraft:infested_stone_bricks",
        cracked_stone_brick: "minecraft:infested_cracked_stone_bricks",
        chiseled_stone_brick: "minecraft:infested_chiseled_stone_bricks"
      }
    },
    "minecraft:red_flower": {
      flower_type: {
        tulip_white: "minecraft:white_tulip",
        poppy: "minecraft:poppy",
        oxeye: "minecraft:oxeye_daisy",
        cornflower: "minecraft:cornflower",
        tulip_orange: "minecraft:orange_tulip",
        lily_of_the_valley: "minecraft:lily_of_the_valley",
        tulip_pink: "minecraft:pink_tulip",
        houstonia: "minecraft:azure_bluet",
        allium: "minecraft:allium",
        tulip_red: "minecraft:red_tulip",
        orchid: "minecraft:blue_orchid"
      }
    },
    "minecraft:leaves": {
      old_leaf_type: {
        oak: "minecraft:oak_leaves",
        birch: "minecraft:birch_leaves",
        spruce: "minecraft:spruce_leaves",
        jungle: "minecraft:jungle_leaves"
      }
    },
    "minecraft:cobblestone_wall": {
      wall_block_type: {
        nether_brick: "minecraft:nether_brick_wall",
        prismarine: "minecraft:prismarine_wall",
        diorite: "minecraft:diorite_wall",
        stone_brick: "minecraft:stone_brick_wall",
        andesite: "minecraft:andesite_wall",
        granite: "minecraft:granite_wall",
        brick: "minecraft:brick_wall",
        end_brick: "minecraft:end_stone_brick_wall",
        red_nether_brick: "minecraft:red_nether_brick_wall",
        cobblestone: "minecraft:cobblestone_wall",
        red_sandstone: "minecraft:red_sandstone_wall",
        mossy_stone_brick: "minecraft:mossy_stone_brick_wall",
        mossy_cobblestone: "minecraft:mossy_cobblestone_wall",
        sandstone: "minecraft:sandstone_wall"
      }
    },
    "minecraft:sandstone": {
      sand_stone_type: {
        smooth: "minecraft:smooth_sandstone",
        cut: "minecraft:cut_sandstone",
        heiroglyphs: "minecraft:chiseled_sandstone",
        default: "minecraft:sandstone"
      }
    },
    "minecraft:red_sandstone": {
      sand_stone_type: {
        smooth: "minecraft:smooth_red_sandstone",
        cut: "minecraft:cut_red_sandstone",
        default: "minecraft:red_sandstone",
        heiroglyphs: "minecraft:chiseled_red_sandstone"
      }
    },
    "minecraft:sand": {
      sand_type: {
        normal: "minecraft:sand",
        red: "minecraft:red_sand"
      }
    },
    "minecraft:coral": {
      coral_color: {
        red: "minecraft:fire_coral",
        blue: "minecraft:tube_coral",
        purple: "minecraft:bubble_coral",
        yellow: "minecraft:horn_coral",
        pink: "minecraft:brain_coral"
      }
    },
    "minecraft:coral_fan": {
      coral_color: {
        blue: "minecraft:tube_coral_fan",
        pink: "minecraft:brain_coral_fan",
        purple: "minecraft:bubble_coral_fan",
        red: "minecraft:fire_coral_fan",
        yellow: "minecraft:horn_coral_fan"
      }
    },
    "minecraft:coral_fan_dead": {
      coral_color: {
        blue: "minecraft:dead_tube_coral_fan",
        pink: "minecraft:dead_brain_coral_fan",
        yellow: "minecraft:dead_horn_coral_fan",
        red: "minecraft:dead_fire_coral_fan",
        purple: "minecraft:dead_bubble_coral_fan"
      }
    },
    "minecraft:prismarine": {
      prismarine_block_type: {
        dark: "minecraft:dark_prismarine",
        default: "minecraft:prismarine",
        bricks: "minecraft:prismarine_bricks"
      }
    },
    "minecraft:double_plant": {
      double_plant_type: {
        fern: "minecraft:large_fern",
        sunflower: "minecraft:sunflower",
        grass: "minecraft:tall_grass",
        paeonia: "minecraft:peony",
        rose: "minecraft:rose_bush",
        syringa: "minecraft:lilac"
      }
    },
    "minecraft:sponge": {
      sponge_type: {
        wet: "minecraft:wet_sponge",
        dry: "minecraft:sponge"
      }
    },
    "minecraft:wool": {
      color: {
        purple: "minecraft:purple_wool",
        orange: "minecraft:orange_wool",
        white: "minecraft:white_wool",
        lime: "minecraft:lime_wool",
        pink: "minecraft:pink_wool",
        green: "minecraft:green_wool",
        yellow: "minecraft:yellow_wool",
        cyan: "minecraft:cyan_wool",
        black: "minecraft:black_wool",
        red: "minecraft:red_wool",
        brown: "minecraft:brown_wool",
        magenta: "minecraft:magenta_wool",
        silver: "minecraft:light_gray_wool",
        gray: "minecraft:gray_wool",
        light_blue: "minecraft:light_blue_wool",
        blue: "minecraft:blue_wool"
      }
    },
    "minecraft:log": {
      old_log_type: {
        birch: "minecraft:birch_log",
        spruce: "minecraft:spruce_log",
        oak: "minecraft:oak_log",
        jungle: "minecraft:jungle_log"
      }
    },
    "minecraft:log2": {
      new_log_type: {
        acacia: "minecraft:acacia_log",
        dark_oak: "minecraft:dark_oak_log"
      }
    },
    "minecraft:fence": {
      wood_type: {
        dark_oak: "minecraft:dark_oak_fence",
        jungle: "minecraft:jungle_fence",
        oak: "minecraft:oak_fence",
        birch: "minecraft:birch_fence",
        spruce: "minecraft:spruce_fence",
        acacia: "minecraft:acacia_fence"
      }
    },
    "minecraft:carpet": {
      color: {
        light_blue: "minecraft:light_blue_carpet",
        silver: "minecraft:light_gray_carpet",
        yellow: "minecraft:yellow_carpet",
        lime: "minecraft:lime_carpet",
        brown: "minecraft:brown_carpet",
        orange: "minecraft:orange_carpet",
        red: "minecraft:red_carpet",
        gray: "minecraft:gray_carpet",
        cyan: "minecraft:cyan_carpet",
        pink: "minecraft:pink_carpet",
        green: "minecraft:green_carpet",
        white: "minecraft:white_carpet",
        blue: "minecraft:blue_carpet",
        black: "minecraft:black_carpet",
        magenta: "minecraft:magenta_carpet",
        purple: "minecraft:purple_carpet"
      }
    },
    "minecraft:shulker_box": {
      color: {
        cyan: "minecraft:cyan_shulker_box",
        green: "minecraft:green_shulker_box",
        gray: "minecraft:gray_shulker_box",
        silver: "minecraft:light_gray_shulker_box",
        orange: "minecraft:orange_shulker_box",
        white: "minecraft:white_shulker_box",
        red: "minecraft:red_shulker_box",
        brown: "minecraft:brown_shulker_box",
        light_blue: "minecraft:light_blue_shulker_box",
        lime: "minecraft:lime_shulker_box",
        magenta: "minecraft:magenta_shulker_box",
        black: "minecraft:black_shulker_box",
        yellow: "minecraft:yellow_shulker_box",
        pink: "minecraft:pink_shulker_box",
        blue: "minecraft:blue_shulker_box",
        purple: "minecraft:purple_shulker_box"
      }
    },
    "minecraft:concrete": {
      color: {
        brown: "minecraft:brown_concrete",
        magenta: "minecraft:magenta_concrete",
        pink: "minecraft:pink_concrete",
        light_blue: "minecraft:light_blue_concrete",
        lime: "minecraft:lime_concrete",
        green: "minecraft:green_concrete",
        purple: "minecraft:purple_concrete",
        cyan: "minecraft:cyan_concrete",
        yellow: "minecraft:yellow_concrete",
        blue: "minecraft:blue_concrete",
        white: "minecraft:white_concrete",
        red: "minecraft:red_concrete",
        gray: "minecraft:gray_concrete",
        black: "minecraft:black_concrete",
        silver: "minecraft:light_gray_concrete",
        orange: "minecraft:orange_concrete"
      }
    },
    "minecraft:stained_glass": {
      color: {
        pink: "minecraft:pink_stained_glass",
        black: "minecraft:black_stained_glass",
        white: "minecraft:white_stained_glass",
        yellow: "minecraft:yellow_stained_glass",
        gray: "minecraft:gray_stained_glass",
        purple: "minecraft:purple_stained_glass",
        brown: "minecraft:brown_stained_glass",
        cyan: "minecraft:cyan_stained_glass",
        silver: "minecraft:light_gray_stained_glass",
        red: "minecraft:red_stained_glass",
        magenta: "minecraft:magenta_stained_glass",
        green: "minecraft:green_stained_glass",
        orange: "minecraft:orange_stained_glass",
        lime: "minecraft:lime_stained_glass",
        blue: "minecraft:blue_stained_glass",
        light_blue: "minecraft:light_blue_stained_glass"
      }
    },
    "minecraft:stained_glass_pane": {
      color: {
        gray: "minecraft:gray_stained_glass_pane",
        lime: "minecraft:lime_stained_glass_pane",
        purple: "minecraft:purple_stained_glass_pane",
        green: "minecraft:green_stained_glass_pane",
        white: "minecraft:white_stained_glass_pane",
        yellow: "minecraft:yellow_stained_glass_pane",
        silver: "minecraft:light_gray_stained_glass_pane",
        magenta: "minecraft:magenta_stained_glass_pane",
        blue: "minecraft:blue_stained_glass_pane",
        light_blue: "minecraft:light_blue_stained_glass_pane",
        pink: "minecraft:pink_stained_glass_pane",
        orange: "minecraft:orange_stained_glass_pane",
        black: "minecraft:black_stained_glass_pane",
        cyan: "minecraft:cyan_stained_glass_pane",
        brown: "minecraft:brown_stained_glass_pane",
        red: "minecraft:red_stained_glass_pane"
      }
    },
    "minecraft:concretepowder": {
      color: {
        light_blue: "minecraft:light_blue_concrete_powder",
        purple: "minecraft:purple_concrete_powder",
        gray: "minecraft:gray_concrete_powder",
        green: "minecraft:green_concrete_powder",
        magenta: "minecraft:magenta_concrete_powder",
        brown: "minecraft:brown_concrete_powder",
        white: "minecraft:white_concrete_powder",
        lime: "minecraft:lime_concrete_powder",
        silver: "minecraft:light_gray_concrete_powder",
        pink: "minecraft:pink_concrete_powder",
        black: "minecraft:black_concrete_powder",
        orange: "minecraft:orange_concrete_powder",
        cyan: "minecraft:cyan_concrete_powder",
        red: "minecraft:red_concrete_powder",
        yellow: "minecraft:yellow_concrete_powder",
        blue: "minecraft:blue_concrete_powder"
      }
    },
    "minecraft:stained_hardened_clay": {
      color: {
        cyan: "minecraft:cyan_terracotta",
        lime: "minecraft:lime_terracotta",
        gray: "minecraft:gray_terracotta",
        black: "minecraft:black_terracotta",
        silver: "minecraft:light_gray_terracotta",
        orange: "minecraft:orange_terracotta",
        white: "minecraft:white_terracotta",
        pink: "minecraft:pink_terracotta",
        purple: "minecraft:purple_terracotta",
        yellow: "minecraft:yellow_terracotta",
        blue: "minecraft:blue_terracotta",
        light_blue: "minecraft:light_blue_terracotta",
        green: "minecraft:green_terracotta",
        magenta: "minecraft:magenta_terracotta",
        brown: "minecraft:brown_terracotta",
        red: "minecraft:red_terracotta"
      }
    },
    "minecraft:stone": {
      stone_type: {
        stone: "minecraft:stone",
        diorite: "minecraft:diorite",
        andesite_smooth: "minecraft:polished_andesite",
        diorite_smooth: "minecraft:polished_diorite",
        andesite: "minecraft:andesite",
        granite: "minecraft:granite",
        granite_smooth: "minecraft:polished_granite"
      }
    },
    "minecraft:planks": {
      wood_type: {
        jungle: "minecraft:jungle_planks",
        oak: "minecraft:oak_planks",
        dark_oak: "minecraft:dark_oak_planks",
        birch: "minecraft:birch_planks",
        spruce: "minecraft:spruce_planks",
        acacia: "minecraft:acacia_planks"
      }
    },
    "minecraft:wooden_slab": {
      wood_type: {
        jungle: "minecraft:jungle_slab",
        oak: "minecraft:oak_slab",
        acacia: "minecraft:acacia_slab",
        spruce: "minecraft:spruce_slab",
        dark_oak: "minecraft:dark_oak_slab",
        birch: "minecraft:birch_slab"
      }
    },
    "minecraft:double_wooden_slab": {
      wood_type: {
        jungle: "minecraft:jungle_slab",
        spruce: "minecraft:spruce_slab",
        oak: "minecraft:oak_slab",
        acacia: "minecraft:acacia_slab",
        dark_oak: "minecraft:dark_oak_slab",
        birch: "minecraft:birch_slab"
      }
    },
    "minecraft:stone_slab": {
      stone_slab_type: {
        brick: "minecraft:brick_slab",
        smooth_stone: "minecraft:smooth_stone_slab",
        nether_brick: "minecraft:nether_brick_slab",
        sandstone: "minecraft:sandstone_slab",
        stone_brick: "minecraft:stone_brick_slab",
        cobblestone: "minecraft:cobblestone_slab",
        quartz: "minecraft:quartz_slab",
        wood: "minecraft:petrified_oak_slab"
      }
    },
    "minecraft:double_stone_slab": {
      stone_slab_type: {
        cobblestone: "minecraft:cobblestone_slab",
        quartz: "minecraft:quartz_slab",
        brick: "minecraft:brick_slab",
        smooth_stone: "minecraft:smooth_stone_slab",
        nether_brick: "minecraft:nether_brick_slab",
        sandstone: "minecraft:sandstone_slab",
        stone_brick: "minecraft:stone_brick_slab",
        wood: "minecraft:petrified_oak_slab"
      }
    },
    "minecraft:concrete_powder": {
      color: {
        purple: "minecraft:purple_concrete_powder",
        orange: "minecraft:orange_concrete_powder",
        pink: "minecraft:pink_concrete_powder",
        lime: "minecraft:lime_concrete_powder",
        cyan: "minecraft:cyan_concrete_powder",
        white: "minecraft:white_concrete_powder",
        black: "minecraft:black_concrete_powder",
        light_blue: "minecraft:light_blue_concrete_powder",
        blue: "minecraft:blue_concrete_powder",
        gray: "minecraft:gray_concrete_powder",
        red: "minecraft:red_concrete_powder",
        green: "minecraft:green_concrete_powder",
        brown: "minecraft:brown_concrete_powder",
        silver: "minecraft:light_gray_concrete_powder",
        yellow: "minecraft:yellow_concrete_powder",
        magenta: "minecraft:magenta_concrete_powder"
      }
    },
    "minecraft:stone_block_slab": {
      stone_slab_type: {
        brick: "minecraft:brick_slab",
        smooth_stone: "minecraft:smooth_stone_slab",
        stone_brick: "minecraft:stone_brick_slab",
        cobblestone: "minecraft:cobblestone_slab",
        nether_brick: "minecraft:nether_brick_slab",
        quartz: "minecraft:quartz_slab",
        sandstone: "minecraft:sandstone_slab",
        wood: "minecraft:petrified_oak_slab"
      }
    },
    "minecraft:double_stone_block_slab": {
      stone_slab_type: {
        stone_brick: "minecraft:stone_brick_slab",
        cobblestone: "minecraft:cobblestone_slab",
        nether_brick: "minecraft:nether_brick_slab",
        sandstone: "minecraft:sandstone_slab",
        brick: "minecraft:brick_slab",
        quartz: "minecraft:quartz_slab",
        smooth_stone: "minecraft:smooth_stone_slab",
        wood: "minecraft:petrified_oak_slab"
      }
    }
  },
  redstoneConnectables: [
    "minecraft:detector_rail",
    "minecraft:redstone_wire",
    "minecraft:lever",
    "minecraft:stone_pressure_plate",
    "minecraft:oak_pressure_plate",
    "minecraft:spruce_pressure_plate",
    "minecraft:birch_pressure_plate",
    "minecraft:jungle_pressure_plate",
    "minecraft:acacia_pressure_plate",
    "minecraft:cherry_pressure_plate",
    "minecraft:dark_oak_pressure_plate",
    "minecraft:pale_oak_pressure_plate",
    "minecraft:mangrove_pressure_plate",
    "minecraft:bamboo_pressure_plate",
    "minecraft:redstone_torch",
    "minecraft:redstone_wall_torch",
    "minecraft:stone_button",
    "minecraft:jukebox",
    "minecraft:repeater",
    "minecraft:tripwire_hook",
    "minecraft:oak_button",
    "minecraft:spruce_button",
    "minecraft:birch_button",
    "minecraft:jungle_button",
    "minecraft:acacia_button",
    "minecraft:cherry_button",
    "minecraft:dark_oak_button",
    "minecraft:pale_oak_button",
    "minecraft:mangrove_button",
    "minecraft:bamboo_button",
    "minecraft:trapped_chest",
    "minecraft:light_weighted_pressure_plate",
    "minecraft:heavy_weighted_pressure_plate",
    "minecraft:comparator",
    "minecraft:daylight_detector",
    "minecraft:redstone_block",
    "minecraft:observer",
    "minecraft:lectern",
    "minecraft:crimson_pressure_plate",
    "minecraft:warped_pressure_plate",
    "minecraft:crimson_button",
    "minecraft:warped_button",
    "minecraft:target",
    "minecraft:polished_blackstone_pressure_plate",
    "minecraft:polished_blackstone_button",
    "minecraft:sculk_sensor",
    "minecraft:calibrated_sculk_sensor",
    "minecraft:lightning_rod",
    "minecraft:exposed_lightning_rod",
    "minecraft:oxidized_lightning_rod",
    "minecraft:waxed_lightning_rod",
    "minecraft:waxed_exposed_lightning_rod",
    "minecraft:waxed_oxidized_lightning_rod",
    "minecraft:waxed_weathered_lightning_rod",
    "minecraft:weathered_lightning_rod",
    "minecraft:acacia_shelf",
    "minecraft:bamboo_shelf",
    "minecraft:birch_shelf",
    "minecraft:cherry_shelf",
    "minecraft:crimson_shelf",
    "minecraft:dark_oak_shelf",
    "minecraft:jungle_shelf",
    "minecraft:mangrove_shelf",
    "minecraft:oak_shelf",
    "minecraft:pale_oak_shelf",
    "minecraft:spruce_shelf",
    "minecraft:warped_shelf"
  ]
};

// data/overrides.json
var overrides_default = {
  names: {},
  flatten: {}
};

// data/aliases.json
var aliases_default = {
  bedrockAliases: {
    "minecraft:concretePowder": "minecraft:concrete_powder",
    "minecraft:stonebrick": "minecraft:stone_bricks",
    "minecraft:wooden_slab": "minecraft:oak_slab",
    "minecraft:wooden_pressure_plate": "minecraft:oak_pressure_plate",
    "minecraft:wooden_button": "minecraft:oak_button",
    "minecraft:hardened_clay": "minecraft:terracotta"
  }
};

// data/state-rules.json
var state_rules_default = {
  common: {
    keyAliases: {
      "minecraft:cardinal_direction": "cardinal_direction",
      "minecraft:facing_direction": "mc_facing_direction",
      "minecraft:vertical_half": "vertical_half",
      "minecraft:block_face": "block_face",
      "minecraft:pillar_axis": "pillar_axis"
    },
    ops: [
      { map: { from: "facing_direction", to: "facing", keepUnmapped: true, values: { "0": "down", "1": "up", "2": "north", "3": "south", "4": "west", "5": "east" } } },
      { rename: { from: "mc_facing_direction", to: "facing" } },
      { rename: { from: "cardinal_direction", to: "facing" } },
      { rename: { from: "pillar_axis", to: "axis" } },
      { map: { from: "vertical_half", to: "type", default: "bottom", values: { top: "top", bottom: "bottom" } } }
    ],
    dropKeys: ["*update*", "age_bit", "age", "minecraft:*"]
  },
  rules: [
    { match: "minecraft:redstone_torch", ops: [
      { set: { lit: "true" } },
      { wallVariant: { from: "torch_facing_direction", wall: "minecraft:redstone_wall_torch", standing: "minecraft:redstone_torch", flip: true } }
    ] },
    { match: "minecraft:unlit_redstone_torch", ops: [
      { set: { lit: "false" } },
      { wallVariant: { from: "torch_facing_direction", wall: "minecraft:redstone_wall_torch", standing: "minecraft:redstone_torch", flip: true } }
    ] },
    { match: "minecraft:torch", ops: [
      { wallVariant: { from: "torch_facing_direction", wall: "minecraft:wall_torch", standing: "minecraft:torch", flip: true } }
    ] },
    { match: "minecraft:soul_torch", ops: [
      { wallVariant: { from: "torch_facing_direction", wall: "minecraft:soul_wall_torch", standing: "minecraft:soul_torch", flip: true } }
    ] },
    { match: "minecraft:sticky_piston_arm_collision", ops: [
      { setName: "minecraft:piston_head" },
      { set: { type: "sticky" } },
      { setDefault: { short: "false" } },
      { map: { from: "facing", to: "facing", keepUnmapped: true, values: { north: "south", south: "north", east: "west", west: "east" } } }
    ] },
    { match: "minecraft:piston_arm_collision", ops: [
      { setName: "minecraft:piston_head" },
      { setDefault: { type: "normal", short: "false" } },
      { map: { from: "facing", to: "facing", keepUnmapped: true, values: { north: "south", south: "north", east: "west", west: "east" } } }
    ] },
    { match: "minecraft:sticky_piston", ops: [
      { setDefault: { extended: "false" } },
      { map: { from: "facing", to: "facing", keepUnmapped: true, values: { north: "south", south: "north", east: "west", west: "east" } } }
    ] },
    { match: "minecraft:piston", ops: [
      { setDefault: { extended: "false" } },
      { map: { from: "facing", to: "facing", keepUnmapped: true, values: { north: "south", south: "north", east: "west", west: "east" } } }
    ] },
    { match: "minecraft:powered_comparator", ops: [
      { map: { from: "output_subtract_bit", to: "mode", values: { "1": "subtract", true: "subtract", "0": "compare", false: "compare" } } },
      { mapBool: { from: "output_lit_bit", to: "powered" } },
      { map: { from: "direction", to: "facing", values: { "0": "south", "1": "west", "2": "north", "3": "east" } } },
      { setDefault: { mode: "compare", powered: "true", facing: "north" } }
    ] },
    { match: "minecraft:unpowered_comparator", ops: [
      { map: { from: "output_subtract_bit", to: "mode", values: { "1": "subtract", true: "subtract", "0": "compare", false: "compare" } } },
      { mapBool: { from: "output_lit_bit", to: "powered" } },
      { map: { from: "direction", to: "facing", values: { "0": "south", "1": "west", "2": "north", "3": "east" } } },
      { setDefault: { mode: "compare", powered: "false", facing: "north" } }
    ] },
    { match: "minecraft:powered_repeater", ops: [
      { set: { powered: "true" } },
      { map: { from: "repeater_delay", to: "delay", values: { "0": "1", "1": "2", "2": "3", "3": "4" } } },
      { map: { from: "direction", to: "facing", values: { "0": "south", "1": "west", "2": "north", "3": "east" } } },
      { setDefault: { delay: "1", locked: "false", facing: "north" } }
    ] },
    { match: "minecraft:unpowered_repeater", ops: [
      { set: { powered: "false" } },
      { map: { from: "repeater_delay", to: "delay", values: { "0": "1", "1": "2", "2": "3", "3": "4" } } },
      { map: { from: "direction", to: "facing", values: { "0": "south", "1": "west", "2": "north", "3": "east" } } },
      { setDefault: { delay: "1", locked: "false", facing: "north" } }
    ] },
    { match: "minecraft:observer", ops: [
      { mapBool: { from: "powered_bit", to: "powered" } },
      { setDefault: { powered: "false" } }
    ] },
    { match: "minecraft:barrel", ops: [
      { mapBool: { from: "open_bit", to: "open" } },
      { setDefault: { open: "false" } }
    ] },
    { match: "minecraft:dropper", ops: [{ mapBool: { from: "triggered_bit", to: "triggered" } }] },
    { match: "minecraft:dispenser", ops: [{ mapBool: { from: "triggered_bit", to: "triggered" } }] },
    { match: "minecraft:hopper", ops: [{ mapBool: { from: "toggle_bit", to: "enabled", invert: true } }] },
    { match: "minecraft:golden_rail", ops: [
      { map: { from: "rail_direction", to: "shape", values: { "0": "north_south", "1": "east_west", "2": "ascending_east", "3": "ascending_west", "4": "ascending_north", "5": "ascending_south" } } },
      { mapBool: { from: "rail_data_bit", to: "powered" } },
      { setDefault: { powered: "false", waterlogged: "false" } }
    ] },
    { match: "minecraft:activator_rail", ops: [
      { map: { from: "rail_direction", to: "shape", values: { "0": "north_south", "1": "east_west", "2": "ascending_east", "3": "ascending_west", "4": "ascending_north", "5": "ascending_south" } } },
      { mapBool: { from: "rail_data_bit", to: "powered" } },
      { setDefault: { powered: "false", waterlogged: "false" } }
    ] },
    { match: "minecraft:detector_rail", ops: [
      { map: { from: "rail_direction", to: "shape", values: { "0": "north_south", "1": "east_west", "2": "ascending_east", "3": "ascending_west", "4": "ascending_north", "5": "ascending_south" } } },
      { mapBool: { from: "rail_data_bit", to: "powered" } },
      { setDefault: { powered: "false", waterlogged: "false" } }
    ] },
    { match: "minecraft:rail", ops: [
      { map: { from: "rail_direction", to: "shape", values: { "0": "north_south", "1": "east_west", "2": "ascending_east", "3": "ascending_west", "4": "ascending_north", "5": "ascending_south", "6": "south_east", "7": "south_west", "8": "north_west", "9": "north_east" } } },
      { setDefault: { shape: "north_south", waterlogged: "false" } }
    ] },
    { match: "minecraft:lectern", ops: [
      { map: { from: "direction", to: "facing", values: { "0": "south", "1": "west", "2": "north", "3": "east" } } },
      { mapBool: { from: "powered_bit", to: "powered" } },
      { setDefault: { facing: "north", powered: "false", has_book: "false" } }
    ] },
    { match: "minecraft:redstone_wire", ops: [
      { rename: { from: "redstone_signal", to: "power" } },
      { setDefault: { east: "none", north: "none", south: "none", west: "none", power: "0" } }
    ] },
    { match: "minecraft:lever", ops: [
      { mapBool: { from: "open_bit", to: "powered" } },
      { map: { from: "lever_direction", values: {
        up_north_south: { face: "floor", facing: "north" },
        up_east_west: { face: "floor", facing: "east" },
        down_north_south: { face: "ceiling", facing: "north" },
        down_east_west: { face: "ceiling", facing: "east" },
        north: { face: "wall", facing: "north" },
        south: { face: "wall", facing: "south" },
        east: { face: "wall", facing: "east" },
        west: { face: "wall", facing: "west" }
      } } },
      { setDefault: { face: "wall", facing: "north", powered: "false" } }
    ] },
    { match: "minecraft:tripwire_hook", ops: [
      { map: { from: "direction", to: "facing", values: { "0": "south", "1": "west", "2": "north", "3": "east" } } },
      { mapBool: { from: "attached_bit", to: "attached" } },
      { mapBool: { from: "powered_bit", to: "powered" } },
      { setDefault: { facing: "north", attached: "false", powered: "false" } }
    ] },
    { match: "minecraft:daylight_detector_inverted", ops: [
      { rename: { from: "redstone_signal", to: "power" } },
      { set: { inverted: "true" } },
      { setDefault: { power: "0" } }
    ] },
    { match: "minecraft:daylight_detector", ops: [
      { rename: { from: "redstone_signal", to: "power" } },
      { setDefault: { inverted: "false", power: "0" } }
    ] },
    { match: "minecraft:sculk_sensor", ops: [
      { map: { from: "sculk_sensor_phase", to: "sculk_sensor_phase", values: { "0": "inactive", "1": "active", "2": "cooldown" } } },
      { setDefault: { sculk_sensor_phase: "inactive", power: "0", waterlogged: "false" } }
    ] },
    { match: "minecraft:crafter", ops: [
      { mapBool: { from: "triggered_bit", to: "triggered" } },
      { map: { from: "crafting", to: "crafting", values: { "0": "false", "1": "true", false: "false", true: "true" } } },
      { setDefault: { orientation: "north_up", triggered: "false", crafting: "false" } }
    ] },
    { match: "minecraft:cauldron", ops: [{ drop: ["cauldron_liquid"] }] },
    { match: "minecraft:lit_redstone_lamp", ops: [{ set: { lit: "true" } }] },
    { match: "minecraft:redstone_lamp", ops: [{ setDefault: { lit: "false" } }] },
    { match: "minecraft:*double_slab*", ops: [
      { set: { type: "double" } },
      { drop: ["top_slot_bit"] },
      { setDefault: { waterlogged: "false" } }
    ] },
    { match: "minecraft:*_slab", ops: [
      { map: { from: "top_slot_bit", to: "type", values: { "1": "top", true: "top", "0": "bottom", false: "bottom" } } },
      { setDefault: { type: "bottom", waterlogged: "false" } }
    ] },
    { match: "minecraft:*button*", ops: [
      { mapBool: { from: "button_pressed_bit", to: "powered" } },
      { map: { from: "facing", keepUnmapped: true, values: {
        down: { face: "ceiling", facing: "north" },
        up: { face: "floor", facing: "north" }
      } } },
      { setDefault: { face: "wall" } }
    ] },
    { match: "minecraft:*trapdoor*", ops: [
      { map: { from: "direction", to: "facing", values: { "0": "east", "1": "west", "2": "south", "3": "north" } } },
      { map: { from: "upside_down_bit", to: "half", values: { "1": "top", true: "top", "0": "bottom", false: "bottom" } } },
      { mapBool: { from: "open_bit", to: "open" } },
      { setDefault: { open: "false", half: "bottom", waterlogged: "false", powered: "false" } }
    ] },
    { match: "minecraft:*_stairs", ops: [
      { map: { from: "weirdo_direction", to: "facing", values: { "0": "east", "1": "west", "2": "south", "3": "north" } } },
      { map: { from: "upside_down_bit", to: "half", values: { "1": "top", true: "top", "0": "bottom", false: "bottom" } } },
      { setDefault: { facing: "north", half: "bottom", shape: "straight", waterlogged: "false" } }
    ] },
    { match: "minecraft:*_door", ops: [
      { map: { from: "facing", to: "facing", keepUnmapped: true, values: { east: "north", west: "south", north: "west", south: "east" } } },
      { mapBool: { from: "open_bit", to: "open" } },
      { map: { from: "upper_block_bit", to: "half", values: { "1": "upper", true: "upper", "0": "lower", false: "lower" } } },
      { map: { from: "door_hinge_bit", to: "hinge", values: { "1": "right", true: "right", "0": "left", false: "left" } } },
      { setDefault: { facing: "north", half: "lower", hinge: "left", open: "false", powered: "false" } }
    ] }
  ]
};

// src/block-mapping.ts
var CHUNKER = chunker_mappings_default;
var OVERRIDES = overrides_default;
var ALIASES = aliases_default;
var STATE_RULES = state_rules_default;
var FLIP_DIR = {
  north: "south",
  south: "north",
  east: "west",
  west: "east"
};
var unmappedSet = /* @__PURE__ */ new Set();
function reportUnmapped() {
  return [...unmappedSet];
}
function resetUnmapped() {
  unmappedSet.clear();
}
function lookupFlatten(flatten, name, props) {
  const rules = flatten?.[name];
  if (!rules) return null;
  for (const [stateKey, valueMap] of Object.entries(rules)) {
    const val = props[stateKey];
    if (val !== void 0) {
      const resolved = valueMap[String(val)];
      if (resolved) {
        delete props[stateKey];
        return resolved;
      }
    }
  }
  return null;
}
function resolveJavaName(bedrockName, props) {
  const o = lookupFlatten(OVERRIDES.flatten, bedrockName, props);
  if (o) return o;
  if (OVERRIDES.names?.[bedrockName]) return OVERRIDES.names[bedrockName];
  const c = lookupFlatten(CHUNKER.flatten, bedrockName, props);
  if (c) return c;
  if (CHUNKER.names?.[bedrockName]) return CHUNKER.names[bedrockName];
  unmappedSet.add(bedrockName);
  {
    const name = "minecraft:" + bedrockName.replace("minecraft:", "");
    return name;
  }
}
var asBool = (v) => v === "1" || v === "true";
function wildcardMatch(pattern, name) {
  if (!pattern.includes("*")) return pattern === name;
  const parts = pattern.split("*");
  let idx = 0;
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    if (seg === "") continue;
    if (i === 0) {
      if (!name.startsWith(seg)) return false;
      idx = seg.length;
    } else if (i === parts.length - 1) {
      return name.slice(idx).endsWith(seg);
    } else {
      const found = name.indexOf(seg, idx);
      if (found === -1) return false;
      idx = found + seg.length;
    }
  }
  return true;
}
function applyOp(op, props, name) {
  if (op.rename) {
    const { from, to } = op.rename;
    if (props[from] !== void 0) {
      props[to] = props[from];
      delete props[from];
    }
    return name;
  }
  if (op.map) {
    const { from, to, values, keepUnmapped, default: def } = op.map;
    const raw = props[from];
    if (raw === void 0) return name;
    const hit = values[raw];
    if (hit !== void 0) {
      delete props[from];
      if (typeof hit === "string") {
        if (to) props[to] = hit;
      } else {
        for (const [k, v] of Object.entries(hit)) props[k] = v;
      }
    } else if (keepUnmapped) {
      if (to && to !== from) {
        props[to] = raw;
        delete props[from];
      }
    } else if (def !== void 0 && to) {
      delete props[from];
      props[to] = def;
    }
    return name;
  }
  if (op.mapBool) {
    const { from, to, invert } = op.mapBool;
    if (props[from] !== void 0) {
      let b = asBool(props[from]);
      if (invert) b = !b;
      delete props[from];
      props[to] = b ? "true" : "false";
    }
    return name;
  }
  if (op.set) {
    for (const [k, v] of Object.entries(op.set)) props[k] = v;
    return name;
  }
  if (op.setDefault) {
    for (const [k, v] of Object.entries(op.setDefault)) if (props[k] === void 0) props[k] = v;
    return name;
  }
  if (op.drop) {
    for (const k of op.drop) delete props[k];
    return name;
  }
  if (op.setName) return op.setName;
  if (op.wallVariant) {
    const { from, wall, standing, flip } = op.wallVariant;
    const dir = props[from];
    delete props[from];
    if (dir && dir !== "top" && dir !== "unknown") {
      props.facing = flip ? FLIP_DIR[dir] ?? dir : dir;
      return wall;
    }
    return standing;
  }
  return name;
}
function applyOps(ops, props, name) {
  for (const op of ops) name = applyOp(op, props, name);
  return name;
}
var DANGEROUS_INPLACE_KEYS = (() => {
  const bad = /* @__PURE__ */ new Set();
  const scan = (ops) => {
    for (const op of ops ?? []) {
      const m = op.map;
      if (!m) continue;
      const to = m.to ?? m.from;
      if (to !== m.from) continue;
      for (const v of Object.values(m.values)) {
        if (typeof v !== "string") continue;
        const back = m.values[v];
        if (back !== void 0 && back !== v) {
          bad.add(m.from);
          break;
        }
      }
    }
  };
  scan(STATE_RULES.common.ops);
  for (const rule of STATE_RULES.rules) scan(rule.ops);
  return bad;
})();
var RESIDUAL_STATE_KEYS = (() => {
  const keys = /* @__PURE__ */ new Set();
  const add = (k) => {
    if (!DANGEROUS_INPLACE_KEYS.has(k)) keys.add(k);
  };
  const collect = (ops) => {
    for (const op of ops ?? []) {
      if (op.map) add(op.map.from);
      if (op.mapBool) add(op.mapBool.from);
      if (op.rename) add(op.rename.from);
      if (op.wallVariant) add(op.wallVariant.from);
      for (const k of op.drop ?? []) add(k);
    }
  };
  collect(STATE_RULES.common.ops);
  for (const rule of STATE_RULES.rules) collect(rule.ops);
  for (const [ns, local] of Object.entries(STATE_RULES.common.keyAliases ?? {})) {
    add(ns);
    add(local);
  }
  for (const pat of STATE_RULES.common.dropKeys ?? []) {
    if (!pat.includes("*")) add(pat);
  }
  return keys;
})();
function renormalizeState(javaName, javaProps = {}) {
  const props = {};
  let residual = false;
  for (const [k, v] of Object.entries(javaProps)) {
    props[k] = typeof v === "boolean" ? v ? "true" : "false" : String(v);
    if (RESIDUAL_STATE_KEYS.has(k)) residual = true;
  }
  if (!residual) {
    return { name: javaName, properties: props };
  }
  const keyAliases = STATE_RULES.common.keyAliases ?? {};
  for (const [ns, local] of Object.entries(keyAliases)) {
    if (props[ns] !== void 0) {
      props[local] = props[ns];
      delete props[ns];
    }
  }
  let name = applyOps(STATE_RULES.common.ops ?? [], props, javaName);
  for (const rule of STATE_RULES.rules) {
    if (wildcardMatch(rule.match, javaName)) {
      name = applyOps(rule.ops, props, name);
      break;
    }
  }
  const dropKeys = STATE_RULES.common.dropKeys ?? [];
  const finalProps = {};
  for (const [k, v] of Object.entries(props)) {
    if (dropKeys.some((pat) => wildcardMatch(pat, k))) continue;
    finalProps[k] = v;
  }
  return { name, properties: finalProps };
}
function mapBlock(bedrockName, bedrockProps = {}) {
  const props = {};
  for (const [k, v] of Object.entries(bedrockProps)) {
    props[k] = typeof v === "boolean" ? v ? "true" : "false" : String(v);
  }
  const keyAliases = STATE_RULES.common.keyAliases ?? {};
  for (const [ns, local] of Object.entries(keyAliases)) {
    if (props[ns] !== void 0) {
      props[local] = props[ns];
      delete props[ns];
    }
  }
  const matchName = ALIASES.bedrockAliases?.[bedrockName] ?? bedrockName;
  let javaName = resolveJavaName(matchName, props);
  javaName = applyOps(STATE_RULES.common.ops ?? [], props, javaName);
  for (const rule of STATE_RULES.rules) {
    if (wildcardMatch(rule.match, matchName)) {
      javaName = applyOps(rule.ops, props, javaName);
      break;
    }
  }
  const dropKeys = STATE_RULES.common.dropKeys ?? [];
  const finalProps = {};
  for (const [k, v] of Object.entries(props)) {
    if (dropKeys.some((pat) => wildcardMatch(pat, k))) continue;
    finalProps[k] = v;
  }
  return { name: javaName, properties: finalProps };
}
function intList(values) {
  const list = new NbtList([], NbtType.Int);
  for (const v of values) list.add(new NbtInt(v));
  return list;
}
function buildStructureNbt({
  size,
  palette,
  blocks,
  dataVersion = 3953
}) {
  const root = new NbtCompound();
  root.set("size", intList(size));
  const paletteList = new NbtList([], NbtType.Compound);
  for (const entry of palette) {
    const pEntry = new NbtCompound();
    pEntry.set("Name", new NbtString(entry.Name));
    if (entry.Properties && Object.keys(entry.Properties).length > 0) {
      const props = new NbtCompound();
      for (const [k, v] of Object.entries(entry.Properties)) {
        props.set(k, new NbtString(String(v)));
      }
      pEntry.set("Properties", props);
    }
    paletteList.add(pEntry);
  }
  root.set("palette", paletteList);
  const blocksList = new NbtList([], NbtType.Compound);
  for (const b of blocks) {
    const bEntry = new NbtCompound();
    bEntry.set("pos", intList(b.pos));
    bEntry.set("state", new NbtInt(b.state));
    blocksList.add(bEntry);
  }
  root.set("blocks", blocksList);
  root.set("DataVersion", new NbtInt(dataVersion));
  const file = new NbtFile("", root, "gzip", false, void 0);
  return file.write();
}

// src/subchunk-parser.ts
var TAG_END = 0;
var TAG_BYTE = 1;
var TAG_SHORT = 2;
var TAG_INT = 3;
var TAG_LONG = 4;
var TAG_FLOAT = 5;
var TAG_DOUBLE = 6;
var TAG_BYTE_ARRAY = 7;
var TAG_STRING = 8;
var TAG_LIST = 9;
var TAG_COMPOUND = 10;
var TAG_INT_ARRAY = 11;
var TAG_LONG_ARRAY = 12;
var NbtReader = class {
  view;
  bytes;
  decoder = new TextDecoder("utf-8");
  pos;
  constructor(bytes, offset) {
    this.bytes = bytes;
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    this.pos = offset;
  }
  readByte() {
    return this.view.getUint8(this.pos++);
  }
  readSignedByte() {
    return this.view.getInt8(this.pos++);
  }
  readShortLE() {
    const v = this.view.getInt16(this.pos, true);
    this.pos += 2;
    return v;
  }
  readIntLE() {
    const v = this.view.getInt32(this.pos, true);
    this.pos += 4;
    return v;
  }
  readLongLE() {
    const v = this.view.getBigInt64(this.pos, true);
    this.pos += 8;
    return Number(v);
  }
  readFloatLE() {
    const v = this.view.getFloat32(this.pos, true);
    this.pos += 4;
    return v;
  }
  readDoubleLE() {
    const v = this.view.getFloat64(this.pos, true);
    this.pos += 8;
    return v;
  }
  readStringLE() {
    const len = this.view.getUint16(this.pos, true);
    this.pos += 2;
    const bytes = this.bytes.subarray(this.pos, this.pos + len);
    this.pos += len;
    return this.decoder.decode(bytes);
  }
  readNamedTag() {
    const type = this.readByte();
    if (type === TAG_END) return null;
    const name = this.readStringLE();
    const value = this.readPayload(type);
    return { name, type, value };
  }
  readCompound() {
    const result = {};
    while (this.pos < this.bytes.length) {
      const tag = this.readNamedTag();
      if (tag === null) break;
      result[tag.name] = tag.value;
    }
    return result;
  }
  readPayload(type) {
    switch (type) {
      case TAG_BYTE:
        return this.readSignedByte();
      case TAG_SHORT:
        return this.readShortLE();
      case TAG_INT:
        return this.readIntLE();
      case TAG_LONG:
        return this.readLongLE();
      case TAG_FLOAT:
        return this.readFloatLE();
      case TAG_DOUBLE:
        return this.readDoubleLE();
      case TAG_BYTE_ARRAY: {
        const len = this.readIntLE();
        const arr = this.bytes.subarray(this.pos, this.pos + len);
        this.pos += len;
        return arr;
      }
      case TAG_STRING:
        return this.readStringLE();
      case TAG_LIST: {
        const listType = this.readByte();
        const listLen = this.readIntLE();
        const items = [];
        for (let i = 0; i < listLen; i++) {
          items.push(this.readPayload(listType));
        }
        return items;
      }
      case TAG_COMPOUND:
        return this.readCompound();
      case TAG_INT_ARRAY: {
        const len = this.readIntLE();
        const arr = [];
        for (let i = 0; i < len; i++) arr.push(this.readIntLE());
        return arr;
      }
      case TAG_LONG_ARRAY: {
        const len = this.readIntLE();
        const arr = [];
        for (let i = 0; i < len; i++) arr.push(this.readLongLE());
        return arr;
      }
      default:
        throw new Error(`Unknown NBT tag type: ${type}`);
    }
  }
};
function readPaletteCompound(reader) {
  const tagType = reader.readByte();
  if (tagType !== TAG_COMPOUND) {
    throw new Error(`Expected TAG_Compound (10), got ${tagType}`);
  }
  reader.readStringLE();
  const compound = reader.readCompound();
  const rawName = compound.name ?? "minecraft:air";
  const states = compound.states ?? {};
  const properties = {};
  if (typeof states === "object" && !(states instanceof Uint8Array)) {
    for (const [k, v] of Object.entries(states)) {
      properties[k] = v;
    }
  }
  return {
    name: rawName.includes(":") ? rawName : "minecraft:" + rawName,
    properties
  };
}
function readBlockStorage(bytes, offset) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const header = view.getUint8(offset++);
  const bitsPerBlock = header >> 1;
  if (bitsPerBlock === 0) {
    const reader2 = new NbtReader(bytes, offset);
    const compound = readPaletteCompound(reader2);
    return {
      palette: [compound],
      blocks: new Uint16Array(4096).fill(0)
    };
  }
  const blocksPerWord = Math.floor(32 / bitsPerBlock);
  const numWords = Math.ceil(4096 / blocksPerWord);
  const mask = (1 << bitsPerBlock) - 1;
  const blocks = new Uint16Array(4096);
  let blockIndex = 0;
  for (let word = 0; word < numWords; word++) {
    if (offset + 4 > bytes.length) break;
    const value = view.getUint32(offset, true);
    offset += 4;
    for (let b = 0; b < blocksPerWord && blockIndex < 4096; b++) {
      blocks[blockIndex++] = value >>> bitsPerBlock * b & mask;
    }
  }
  if (offset + 4 > bytes.length) {
    return { palette: [{ name: "minecraft:air", properties: {} }], blocks };
  }
  const paletteSize = view.getInt32(offset, true);
  offset += 4;
  const palette = [];
  const reader = new NbtReader(bytes, offset);
  for (let i = 0; i < paletteSize; i++) {
    try {
      const entry = readPaletteCompound(reader);
      palette.push(entry);
    } catch {
      palette.push({ name: "minecraft:unknown", properties: {} });
      break;
    }
  }
  return { palette, blocks };
}
function parseSubChunk(buffer) {
  if (!buffer || buffer.length === 0) return null;
  let offset = 0;
  const version = buffer[offset++];
  if (version < 8) return null;
  const numLayers = buffer[offset++];
  if (version === 9) offset++;
  if (numLayers === 0) return null;
  return readBlockStorage(buffer, offset);
}

// src/post-process.ts
var DIR_OFFSETS = {
  down: [0, -1, 0],
  up: [0, 1, 0],
  north: [0, 0, -1],
  south: [0, 0, 1],
  west: [-1, 0, 0],
  east: [1, 0, 0]
};
var redstoneConnectableNames = chunker_mappings_default.redstoneConnectables ?? [];
var REDSTONE_CONNECTABLES = new Set(redstoneConnectableNames);
function isRedstoneConnectable(name, props, dx, dz) {
  if (name === "minecraft:redstone_wire") return true;
  if (name === "minecraft:repeater" || name === "minecraft:comparator" || name === "minecraft:observer") {
    const facing = props?.facing;
    if (dx !== 0 && (facing === "east" || facing === "west")) return true;
    if (dz !== 0 && (facing === "north" || facing === "south")) return true;
    return false;
  }
  if (REDSTONE_CONNECTABLES.has(name)) return true;
  if (name.includes("button") || name.includes("pressure_plate") || name.includes("trapdoor") || name.includes("door") || name.includes("rail")) {
    return true;
  }
  return false;
}
function postProcessBlocks(blocks, palette) {
  const posMap = /* @__PURE__ */ new Map();
  for (let i = 0; i < blocks.length; i++) {
    const [x, y, z] = blocks[i].pos;
    posMap.set(`${x},${y},${z}`, i);
  }
  const modifiedPalette = [...palette];
  const paletteMap = /* @__PURE__ */ new Map();
  for (let i = 0; i < modifiedPalette.length; i++) {
    const e = modifiedPalette[i];
    const props = e.Properties ?? {};
    const propStr = Object.entries(props).sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => `${k}=${v}`).join(",");
    paletteMap.set(`${e.Name}|${propStr}`, i);
  }
  const getOrCreatePalette = (name, props) => {
    const propStr = Object.entries(props).sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => `${k}=${v}`).join(",");
    const key = `${name}|${propStr}`;
    let idx = paletteMap.get(key);
    if (idx === void 0) {
      idx = modifiedPalette.length;
      modifiedPalette.push({ Name: name, Properties: { ...props } });
      paletteMap.set(key, idx);
    }
    return idx;
  };
  const modifiedBlocks = blocks.map((b) => ({ ...b, pos: [...b.pos] }));
  const getBlockAt = (x, y, z) => {
    const idx = posMap.get(`${x},${y},${z}`);
    if (idx === void 0) return null;
    return modifiedPalette[modifiedBlocks[idx].state];
  };
  for (let i = 0; i < blocks.length; i++) {
    const stateIdx = blocks[i].state;
    const entry = modifiedPalette[stateIdx];
    const name = entry.Name;
    const [hx, hy, hz] = blocks[i].pos;
    if (name === "minecraft:piston_head") {
      const facing = entry.Properties?.facing;
      if (facing && DIR_OFFSETS[facing]) {
        const off = DIR_OFFSETS[facing];
        const baseX = hx - off[0], baseY = hy - off[1], baseZ = hz - off[2];
        const baseBlockIdx = posMap.get(`${baseX},${baseY},${baseZ}`);
        if (baseBlockIdx !== void 0) {
          const baseEntry = modifiedPalette[modifiedBlocks[baseBlockIdx].state];
          if (baseEntry.Name === "minecraft:piston" || baseEntry.Name === "minecraft:sticky_piston") {
            const extProps = { ...baseEntry.Properties ?? {}, extended: "true" };
            modifiedBlocks[baseBlockIdx].state = getOrCreatePalette(baseEntry.Name, extProps);
          }
        }
      }
    }
    if (name === "minecraft:redstone_wire") {
      const origProps = entry.Properties ?? {};
      const newProps = { ...origProps };
      const checkDir = (dx, dz) => {
        const sideBlock = getBlockAt(hx + dx, hy, hz + dz);
        if (sideBlock && isRedstoneConnectable(sideBlock.Name, sideBlock.Properties, dx, dz)) return "side";
        const upBlock = getBlockAt(hx + dx, hy + 1, hz + dz);
        if (upBlock && upBlock.Name === "minecraft:redstone_wire") return "up";
        const downBlock = getBlockAt(hx + dx, hy - 1, hz + dz);
        if (downBlock && downBlock.Name === "minecraft:redstone_wire") return "side";
        return "none";
      };
      let north = checkDir(0, -1);
      let south = checkDir(0, 1);
      let east = checkDir(1, 0);
      let west = checkDir(-1, 0);
      const hasNs = north !== "none" || south !== "none";
      const hasEw = east !== "none" || west !== "none";
      if (hasNs && !hasEw) {
        if (north === "none") north = "side";
        if (south === "none") south = "side";
      } else if (hasEw && !hasNs) {
        if (east === "none") east = "side";
        if (west === "none") west = "side";
      }
      newProps.north = north;
      newProps.south = south;
      newProps.east = east;
      newProps.west = west;
      modifiedBlocks[i].state = getOrCreatePalette(name, newProps);
    }
  }
  return { blocks: modifiedBlocks, palette: modifiedPalette };
}

export { mapBlock, postProcessBlocks, reportUnmapped, resetUnmapped };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map