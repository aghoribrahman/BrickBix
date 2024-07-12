import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { RequirementFormProps } from "../../interfaces/common";
import CustomButton from "./CustomButton";

import { useState } from "react";
  
const RequirementForm = ({
  type,
  register,
  handleSubmit,
  formLoading,
  onFinishHandler,
}: RequirementFormProps) => {

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleClick = () => {
      // Update state to disable the button
      setIsButtonDisabled(true);

      // Perform your desired action here
      // For example, make an API call, perform validation, etc.
      // Once the action is completed, you can re-enable the button if needed
  };
  return (
    
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        {type} a Requirement
      </Typography>

      <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#fcfcfc">
        <form
          style={{
            marginTop: "20px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
          onSubmit={handleSubmit(onFinishHandler)}
        >
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Requirement
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("title", { required: true })}
            />
          </FormControl>
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Description & Your Contact Information
            </FormHelperText>
            <TextareaAutosize
              minRows={5}
              required
              placeholder="Write description"
              color="info"
              style={{
                width: "100%",
                background: "transparent",
                fontSize: "16px",
                borderColor: "rgba(0,0,0,0.23)",
                borderRadius: 6,
                padding: 10,
                color: "#919191",
              }}
              {...register("description", { required: true })}
            />
          </FormControl>

          <Stack direction={{ xs: "column", sm: "row" }} gap={4}>
            <FormControl sx={{ flex: 1 }}>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Select Requirement Type
              </FormHelperText>
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue="apartment"
                {...register("propertyType", {
                  required: true,
                })}
              >
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="Rental">Rental</MenuItem>
                <MenuItem value="Commercial">Commercial</MenuItem>
                <MenuItem value="farmhouse">Farmhouse</MenuItem>
                <MenuItem value="Duplex">Duplex</MenuItem>
                <MenuItem value="Plot">Plot</MenuItem>
                <MenuItem value="Land">Land</MenuItem>
                <MenuItem value="Room">Room</MenuItem>
              </Select>
              
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Deal Type
              </FormHelperText>
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue="apartment"
                {...register("dealType", {
                  required: true,
                })}
              >
                <MenuItem value="Direct">Direct</MenuItem>
                <MenuItem value="Indirect">Indirect</MenuItem>
              </Select>
              
            </FormControl>
            
            
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Enter Budget
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                type="number"
                variant="outlined"
                {...register("askedPrice", { required: true })}
              />
            </FormControl>
            
          </Stack>
          <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Enter Phone Number
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                type="number"
                variant="outlined"
                {...register("phone", { required: true })}
              />

          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Enter Location
            </FormHelperText>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              color="info"
              variant="outlined"
              {...register("location", { required: true })}
            />
          </FormControl>

          {/*<Form1.Item label="Image">
            <Form1.Item
              name="image"
              valuePropName="fileList"
              noStyle
            >
              <Upload.Dragger
                name="file"
                action={`/media/upload`}
                listType="picture"
                maxCount={5}
                multiple
              >
                <p className="ant-upload-text">Drag & drop a file in this area</p>
              </Upload.Dragger>
            </Form1.Item>
                </Form1.Item>*/}

          <CustomButton
            type="submit"
            title={formLoading ? "Submitting..." : "Submit"}
            backgroundColor="#475be8"
            color="#fcfcfc"
            handleClick={handleClick}
            disabled={formLoading}
          />
        </form>
      </Box>
    </Box>
  );
};

export default RequirementForm;
