# NewChunkMetadataTypes


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**created_at** | **datetime** | Timestamp of the creation of the chunk | 
**dataset_id** | **str** | ID of the dataset which the chunk belongs to | 
**id** | **str** |  | 
**image_urls** | **List[Optional[str]]** |  | [optional] 
**link** | **str** | Link to the chunk, should be a URL | [optional] 
**location** | [**GeoInfo**](GeoInfo.md) |  | [optional] 
**metadata** | **object** | Metadata of the chunk, can be any JSON object | [optional] 
**num_value** | **float** |  | [optional] 
**tag_set** | **List[Optional[str]]** | Tag set of the chunk, can be any list of strings. Used for tag-filtered searches. | [optional] 
**time_stamp** | **datetime** |  | [optional] 
**tracking_id** | **str** |  | [optional] 
**updated_at** | **datetime** | Timestamp of the last update of the chunk | 
**weight** | **float** |  | 
**chunk_html** | **str** |  | [optional] 

## Example

```python
from trieve_py_client.models.new_chunk_metadata_types import NewChunkMetadataTypes

# TODO update the JSON string below
json = "{}"
# create an instance of NewChunkMetadataTypes from a JSON string
new_chunk_metadata_types_instance = NewChunkMetadataTypes.from_json(json)
# print the JSON string representation of the object
print(NewChunkMetadataTypes.to_json())

# convert the object into a dict
new_chunk_metadata_types_dict = new_chunk_metadata_types_instance.to_dict()
# create an instance of NewChunkMetadataTypes from a dict
new_chunk_metadata_types_form_dict = new_chunk_metadata_types.from_dict(new_chunk_metadata_types_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


