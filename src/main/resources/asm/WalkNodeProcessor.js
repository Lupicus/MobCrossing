var asmapi = Java.type('net.minecraftforge.coremod.api.ASMAPI')
var opc = Java.type('org.objectweb.asm.Opcodes')
var JumpInsnNode = Java.type('org.objectweb.asm.tree.JumpInsnNode')

function initializeCoreMod() {
	return {
		'WalkNodeProcessor': {
			'target': {
				'type': 'CLASS',
				'name': 'net.minecraft.pathfinding.WalkNodeProcessor'
			},
			'transformer': function(classNode) {
				var count = 0
				var fn = asmapi.mapMethod('func_237238_b_') // func_237238_b_
				for (var i = 0; i < classNode.methods.size(); ++i) {
					var obj = classNode.methods.get(i)
					if (obj.name == fn) {
						patch_func_237238_b_(obj)
						count++
					}
				}
				if (count < 1)
					asmapi.log("ERROR", "Failed to modify WalkNodeProcessor: Method not found")
				return classNode;
			}
		}
	}
}

// add jump over rail if block
function patch_func_237238_b_(obj) {
	var node = asmapi.findFirstInstruction(obj, opc.INSTANCEOF)
	while (node && node.desc != 'net/minecraft/block/AbstractRailBlock') {
		var index = obj.instructions.indexOf(node)
		node = asmapi.findFirstInstructionAfter(obj, opc.INSTANCEOF, index + 1)
	}
	if (node) {
		var node2 = node.getNext()
		node = node.getPrevious()
		obj.instructions.insertBefore(node, new JumpInsnNode(opc.GOTO, node2.label))
	}
	else
		asmapi.log("ERROR", "Failed to modify WalkNodeProcessor: RAIL not found")
}
