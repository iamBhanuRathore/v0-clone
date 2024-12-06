import { FileItem, Step, StepType } from "../types/index.d";

// Function to process steps and update the file structure accordingly
export const processSteps = (steps: Step[], files: FileItem[]): FileItem[] => {
  // Create a copy of the existing file structure to avoid mutating the original
  const updatedFiles = [...files];
  let isUpdated = false; // Flag to track if any changes were made

  // Loop through each step to process it
  steps.forEach((step) => {
    // Only process steps that are pending and of type "CreateFile"
    if (step.status !== "pending" || step.type !== StepType.CreateFile) return;

    isUpdated = true; // Mark that changes are being made

    // Split the file path into parts for hierarchical processing
    const parsedPath = step.path?.split("/") ?? [];
    let currentStructure = updatedFiles; // Start with the root of the file structure

    // Process each part of the file path to build the structure
    parsedPath.forEach((part, index) => {
      const currentPath = `/${parsedPath.slice(0, index + 1).join("/")}`; // Generate the current path
      const isFile = index === parsedPath.length - 1; // Check if this part represents a file

      // Check if a file or folder already exists at the current path
      let existingItem = currentStructure.find(
        (item) => item.path === currentPath
      );

      // If the item doesn't exist, create a new file or folder
      if (!existingItem) {
        const newItem: FileItem = isFile
          ? {
              name: part, // File name
              type: "file",
              path: currentPath, // Full path of the file
              content: step.code, // File content from the step
            }
          : {
              name: part, // Folder name
              type: "folder",
              path: currentPath, // Full path of the folder
              children: [], // Initialize folder children as an empty array
            };

        currentStructure.push(newItem); // Add the new item to the current structure
        existingItem = newItem; // Update the reference to the newly created item
      }

      // If the item is a folder, ensure it has a `children` property
      if (!isFile && !existingItem.children) {
        existingItem.children = [];
      }

      // Navigate deeper into the structure for folders
      currentStructure = isFile ? currentStructure : existingItem.children!;
    });
  });

  // If changes were made, return the updated file structure; otherwise, return the original
  return isUpdated ? updatedFiles : files;
};
