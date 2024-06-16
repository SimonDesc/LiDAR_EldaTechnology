import pdal
import json

pipeline = """
{
    "pipeline": [
        {
            "type": "readers.las",
            "filename": "C:/Users/33669/Desktop/Elda/example_LiDAR/LHD_FXX_0561_6282_PTS_C_LAMB93_IGN69.copc.laz"
        },
        {
            "type": "writers.text",
            "filename": "sortie.txt"
        }
    ]
}
"""



# Créer le pipeline PDAL
print("...pipeline")
pipeline = pdal.Pipeline(pipeline)
print("...execute")
pipeline.execute()

print("read and print")
# Lire et afficher les résultats
with open("sortie.txt", "r") as file:
    output = file.read()
    print(output)
