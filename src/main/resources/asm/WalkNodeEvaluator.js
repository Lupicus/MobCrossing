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
				var fn = asmapi.mapMethod('m_6603_') // evaluateBlockPathType
				var fn2 = asmapi.mapMethod('m_264405_') // evaluateBlockPathType 1.19.4
				for (var i = 0; i < classNode.methods.size(); ++i) {
					var obj = classNode.methods.get(i)
					if (obj.name == fn || obj.name == fn2) {
						patch_m_6603_(obj)
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
function patch_m_6603_(obj) {
	var node = asmapi.findFirstInstruction(obj, opc.GETSTATIC)
	while (node && !(node.name == 'RAIL' && node.owner == 'net/minecraft/world/level/pathfinder/BlockPathTypes')) {
		var index = obj.instructions.indexOf(node)
		node = asmapi.findFirstInstructionAfter(obj, opc.GETSTATIC, index + 1)
	}
	if (node) {
		var node2 = node.getNext()
		node = node.getPrevious()
		obj.instructions.insertBefore(node, new JumpInsnNode(opc.GOTO, node2.label))
	}
	else
		asmapi.log("ERROR", "Failed to modify WalkNodeEvaluator: RAIL not found")
}
