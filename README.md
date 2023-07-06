# DICOMDownloadToDICOMDIR7zip 

## 程式功能
這是一個使用 NodeJS 與 dcmtk 結合的程式，其主要功能如下：

1. 透過 WADO 或 C-Move 協定下載 DICOM 檔案。
2. 下載後的所有 DICOM 檔案會被轉換成 DICOMDIR 檔案。
3. 將整個 DICOMDIR 資料夾壓縮成一個 7zip 壓縮檔。
4. 提供簡易的 QIDO（Query based on ID for DICOM Objects）功能，用於查詢 DICOM 檔案。
5. 提供 C-FIND（DICOM Composite Object Instance Query）功能，用於對 DICOM 檔案進行查詢。

## 安裝
請按照以下步驟安裝並設置程式：

1. 安裝 NodeJS：確保您的系統已安裝 NodeJS。如果尚未安裝，您可以從 [Node.js 官方網站](https://nodejs.org) 下載並安裝 NodeJS。

2. 下載程式：下載程式的程式碼並將其解壓縮到您選擇的目錄中。

3. 安裝相依套件：在程式碼目錄中打開終端機或命令提示字元，執行以下命令以安裝相依套件：

```
npm install
```

這將自動安裝所需的相依套件，以便程式能正常運行。

## 使用

1. 在程式碼目錄中，使用終端機或命令提示字元執行以下命令以啟動程式：
```
node DICOMDownloadToDICOMDIR7zip.js
```

2. 程式啟動後，您將看到一個選單，根據您的需求選擇相應的功能。

3. 如果您需要下載 DICOM 檔案，選擇 WADO 或 C-Move 協定並提供相關的連接資訊。

4. 如果您需要進行 QIDO 查詢，選擇 QIDO 功能並提供適當的查詢參數。

5. 如果您需要進行 C-FIND 查詢，選擇 C-FIND 功能並提供適當的查詢參數。

6. 程式將根據您的選擇執行相應的操作，並在完成後提供結果或下載的 DICOM檔案。

7. 請注意，程式可能需要訪問遠端的 DICOM 服務器或存儲位置，請確保您提供的連接資訊正確且可用。

這就是 DICOMDownloadToDICOMDIR7zip 程式的功能介紹和安裝使用手冊。希望這能幫助您順利安裝並使用該程式。

