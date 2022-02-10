var asmapi = Java.type('net.minecraftforge.coremod.api.ASMAPI')
var opc = Java.type('org.objectweb.asm.Opcodes')
var JumpInsnNode = Java.type('org.objectweb.asm.tree.JumpInsnNode')

function initializeCoreMod() {
	return {
		'WalkNodeEvaluator': {
			'target': {
				'type': 'CLASS',
				'name': 'net.minecraft.world.level.pathfinder.WalkNodeEvaluator'
			},
			'transformer': function(classNode) {
				var count = 0
				var fn = asmapi.mapMethod('m_77643_') // getBlockPathTypeRaw
				for (var i = 0; i < classNode.methods.size(); ++i) {
					var obj = classNode.methods.get(i)
					if (obj.name == fn) {
						patch_m_77643_(obj)
						count++
					}
				}
				if (count < 1)
					asmapi.log("ERROR", "Failed to modify WalkNodeEvaluator: Method not found")
				return classNode;
			}
		}
	}
}

// add jump over rail if block
function patch_m_77643_(obj) {
	var node = asmapi.findFirstInstruction(obj, opc.INSTANCEOF)
	while (node && node.desc != 'net/minecraft/world/level/block/BaseRailBlock') {
		var index = obj.instructions.indexOf(node)
		node = asmapi.findFirstInstructionAfter(obj, opc.INSTANCEOF, index + 1)
	}
	if (node) {
		var node2 = node.getNext()
		node = node.getPrevious()
		obj.instructions.insertBefore(node, new JumpInsnNode(opc.GOTO, node2.label))
	}
	else
		asmapi.log("ERROR", "Failed to modify WalkNodeEvaluator: RAIL not found")
}
