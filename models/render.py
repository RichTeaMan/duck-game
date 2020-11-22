import sys
import bpy
import mathutils
from PIL import Image


def update_camera(camera, focus_point=mathutils.Vector((0.0, 0.0, 0.0)), distance=10.0):
    """
    Focus the camera to a focus point and place the camera at a specific distance from that
    focus point. The camera stays in a direct line with the focus point.

    :param camera: the camera object
    :type camera: bpy.types.object
    :param focus_point: the point to focus on (default=``mathutils.Vector((0.0, 0.0, 0.0))``)
    :type focus_point: mathutils.Vector
    :param distance: the distance to keep to the focus point (default=``10.0``)
    :type distance: float
    """
    looking_direction = camera.location - focus_point
    rot_quat = looking_direction.to_track_quat('Z', 'Y')

    camera.rotation_euler = rot_quat.to_euler()
    #camera.location = rot_quat * mathutils.Vector((0.0, 0.0, distance))

# update_camera(bpy.data.objects['Camera'])


def render_direction(direction_name, camera_x, camera_y):
    filepath = f"F:/projects/duck-game/models/renders/test-{direction_name}.png"
    cam = bpy.data.cameras.new(f"Camera-{direction_name}")
    cam.lens = 18

    # create the first camera object
    cam_obj = bpy.data.objects.new(f"CameraObj-{direction_name}", cam)
    cam_obj.location = (camera_x, camera_y, 0.6)
    cam_obj.rotation_euler = (0, 0, 0)
    scn.collection.objects.link(cam_obj)

    update_camera(cam_obj)

    scn.camera = cam_obj
    bpy.context.scene.render.filepath = filepath
    bpy.ops.render.render(animation=False, write_still=True,
                          use_viewport=False, layer='', scene='')
    return filepath


scn = bpy.context.scene

# create the first camera
cam1 = bpy.data.cameras.new("Camera t")
cam1.lens = 18

# create the first camera object
cam_obj1 = bpy.data.objects.new("Camera t", cam1)
cam_obj1.location = (-0.5, -0.5, 0.6)
cam_obj1.rotation_euler = (0.6799, 0, 0.8254)
scn.collection.objects.link(cam_obj1)

bpy.ops.render.render(animation=False, write_still=True,
                      use_viewport=False, layer='', scene='')

files = []
files.append(render_direction("W", -.5, 0))
files.append(render_direction("NW", -.5, -.5))
files.append(render_direction("N", 0, -.5))
files.append(render_direction("NE", .5, -.5))
files.append(render_direction("E", .5, 0))
files.append(render_direction("SE", .5, .5))
files.append(render_direction("S", 0, .5))
files.append(render_direction("SW", -.5, .5))


images = [Image.open(x) for x in files]
widths, heights = zip(*(i.size for i in images))

# sheet is padded
total_width = 32 * 128
total_height = sum(heights)

new_im = Image.new('RGBA', (total_width, total_height))

x_offset = 0
y_offset = 0
for im in images:
    new_im.paste(im, (x_offset, y_offset))
    #x_offset += im.size[0]
    y_offset += im.size[1]

new_im.save("F:/projects/duck-game/public/assets/duck-white-spritesheet.png")
