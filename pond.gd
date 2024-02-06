extends Node3D

var value = 0.0
var diff = 0.2

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass


func _on_timer_timeout():
	value += diff
	if value <= 0.0 || value >= 1.0:
		print("!")
		diff = -diff
	$Duck.beak(value)
	print(value)
	pass # Replace with function body.
