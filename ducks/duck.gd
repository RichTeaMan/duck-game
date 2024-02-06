extends Node3D


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func beak(value):
	pass
	var d = %duck/Duck
	var mesh : MeshInstance3D = %duck/Duck
	d.set("blend_shapes/mouth", value)
