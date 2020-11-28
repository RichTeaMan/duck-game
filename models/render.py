import sys
import math
import pathlib
import bpy
import mathutils
from PIL import Image

modelDir = pathlib.Path(__file__).parent.absolute()

scn = bpy.context.scene
images_created = 0

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
    camera.rotation_euler[0] = math.radians(54.736) # angle for isometric projection
    #camera.location = rot_quat * mathutils.Vector((0.0, 0.0, distance))

# update_camera(bpy.data.objects['Camera'])


def render_direction(direction_name, camera_x, camera_y):
    global images_created
    filepath = f"{modelDir}/renders/{images_created}.png"

    camera_object_name = f"CameraObj-{direction_name}"
    cam_obj = bpy.data.objects.get(camera_object_name)

    if (not cam_obj):
        cam = bpy.data.cameras.new(f"Camera-{direction_name}")
        cam.lens = 18
        cam.type = 'ORTHO'
        cam.ortho_scale = 1.4

        # create the first camera object
        cam_obj = bpy.data.objects.new(camera_object_name, cam)
        cam_obj.location = (camera_x, camera_y, 0.5)
        cam_obj.rotation_euler = (0, 0, 0)
        scn.collection.objects.link(cam_obj)

        update_camera(cam_obj)

    scn.camera = cam_obj
    bpy.context.scene.render.filepath = filepath
    bpy.ops.render.render(animation=False, write_still=True,
                          use_viewport=False, layer='', scene='')
    images_created = images_created + 1
    return filepath

def render_frames(files):
    offset = 0.4
    files.append(render_direction("W", -offset, 0))
    files.append(render_direction("NW", -offset, -offset))
    files.append(render_direction("N", 0, -offset))
    files.append(render_direction("NE", offset, -offset))
    files.append(render_direction("E", offset, 0))
    files.append(render_direction("SE", offset, offset))
    files.append(render_direction("S", 0, offset))
    files.append(render_direction("SW", -offset, offset))

def renderDuck(skin_name):
    body_texture_image = bpy.data.images[f"duck-texture-{skin_name}"]
    body_material = bpy.data.materials.get("duck-body")
    body_bsdf = body_material.node_tree.nodes["Principled BSDF"]
    body_shader_node_texture_image = body_material.node_tree.nodes.new('ShaderNodeTexImage')
    body_shader_node_texture_image.image = body_texture_image
    body_material.node_tree.links.new(body_bsdf.inputs['Base Color'], body_shader_node_texture_image.outputs['Color'])

    wing_texture_image = bpy.data.images[f"duck-wing-texture-{skin_name}"]
    wing_material = bpy.data.materials.get("duck-wing")
    wing_bsdf = wing_material.node_tree.nodes["Principled BSDF"]
    wing_shader_node_texture_image = wing_material.node_tree.nodes.new('ShaderNodeTexImage')
    wing_shader_node_texture_image.image = wing_texture_image
    wing_material.node_tree.links.new(wing_bsdf.inputs['Base Color'], wing_shader_node_texture_image.outputs['Color'])

    files = []


    # tail wagging
    bpy.data.shape_keys["Key.001"].key_blocks["tail-right"].value = 1.0
    render_frames(files)
    bpy.data.shape_keys["Key.001"].key_blocks["tail-right"].value = 0.5
    render_frames(files)
    bpy.data.shape_keys["Key.001"].key_blocks["tail-right"].value = 0.0
    render_frames(files)
    bpy.data.shape_keys["Key.001"].key_blocks["tail-left"].value = 0.5
    render_frames(files)
    bpy.data.shape_keys["Key.001"].key_blocks["tail-left"].value = 1.0
    render_frames(files)
    bpy.data.shape_keys["Key.001"].key_blocks["tail-left"].value = 0.0

    # feeding
    render_frames(files) # wasted frame for laziness reasons
    bpy.data.shape_keys["Key.001"].key_blocks["feed"].value = 0.5
    render_frames(files)
    bpy.data.shape_keys["Key.001"].key_blocks["feed"].value = 1.0
    render_frames(files)
    bpy.data.shape_keys["Key.001"].key_blocks["feed"].value = 0.0

    # mouth
    render_frames(files) # wasted frame for laziness reasons
    bpy.data.shape_keys["Key.001"].key_blocks["mouth"].value = 0.5
    render_frames(files)
    bpy.data.shape_keys["Key.001"].key_blocks["mouth"].value = 1.0
    render_frames(files)
    bpy.data.shape_keys["Key.001"].key_blocks["mouth"].value = 0.0

    # swim flapping
    render_frames(files) # wasted frame for laziness reasons
    bpy.data.shape_keys["Key.001"].key_blocks["standing"].value = 0.5
    bpy.data.shape_keys["Key"].key_blocks["wing-standing"].value = 0.5
    bpy.data.shape_keys["Key"].key_blocks["standing-flap"].value = 0.5
    render_frames(files)
    bpy.data.shape_keys["Key.001"].key_blocks["standing"].value = 1.0
    bpy.data.shape_keys["Key"].key_blocks["wing-standing"].value = 1.0
    bpy.data.shape_keys["Key"].key_blocks["standing-flap"].value = 1.0
    render_frames(files)
    bpy.data.shape_keys["Key.001"].key_blocks["standing"].value = 1.0
    bpy.data.shape_keys["Key"].key_blocks["wing-standing"].value = 1.0
    bpy.data.shape_keys["Key"].key_blocks["standing-flap"].value = 1.0
    render_frames(files)
    bpy.data.shape_keys["Key"].key_blocks["standing-flap-up"].value = 1.0
    render_frames(files)
    bpy.data.shape_keys["Key"].key_blocks["standing-flap-up"].value = 0.0
    bpy.data.shape_keys["Key"].key_blocks["standing-flap-down"].value = 1.0
    render_frames(files)

    bpy.data.shape_keys["Key.001"].key_blocks["standing"].value = 0.0
    bpy.data.shape_keys["Key"].key_blocks["wing-standing"].value = 0.0
    bpy.data.shape_keys["Key"].key_blocks["standing-flap"].value = 0.0
    bpy.data.shape_keys["Key"].key_blocks["standing-flap-up"].value = 0.0
    bpy.data.shape_keys["Key"].key_blocks["standing-flap-down"].value = 0.0

    images = [Image.open(x) for x in files]
    widths, heights = zip(*(i.size for i in images))

    # sheet is padded
    total_width = 32 * 512
    total_height = 8 * 512

    new_im = Image.new('RGBA', (total_width, total_height))

    x_offset = 0
    y_offset = 0
    count = 0
    for im in images:
        new_im.paste(im, (x_offset, y_offset))
        count = count + 1
        if count % 8 == 0:
            y_offset = 0
            x_offset += im.size[0]
        else:
            y_offset += im.size[1]

    new_im.save(f"{modelDir}/../public/assets/duck-{skin_name}-spritesheet.png")

renderDuck("white")
renderDuck("mallard")
renderDuck("brown")
renderDuck("duckling")

print(f"Render complete. {images_created} images rendered.")