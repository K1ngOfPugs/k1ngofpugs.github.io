#################### NOTE #######################
### THIS IS NOT INDENTED TO BE HUMAN-READABLE ###
#################################################
import os
import json
def scan_directory(directory):
    directory_structure = []
    for root, dirs, files in os.walk(directory):
        relative_path = os.path.relpath(root, directory)
        parts = relative_path.split(os.sep) if relative_path != '.' else []
        current_level = directory_structure
        for part in parts:
            for item in current_level:
                if item["name"] == part and item["type"] == "folder":
                    current_level = item.setdefault("children", [])
                    break
        for dir_name in dirs:
            current_level.append({"name": dir_name,"type": "folder","children": []})
        for file_name in files:
            current_level.append({"name": file_name,"type": "file"})
    return directory_structure
def save(data, output_file):
    with open(output_file, 'w') as json_file:
        json.dump(data, json_file, indent=4)
if __name__ == "__main__": 
    try:
        os.remove("directory.json")
    except:
        pass
    with open("directory.json", 'w') as json_file:
        json.dump(scan_directory("repos"), json_file, indent=4)
    print("Directory structure saved.")