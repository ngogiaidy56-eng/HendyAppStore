/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Cổng mã hóa tệp tin Keystore, P12, PFX sang Base64 sạch
 */
import React, { useState } from 'react';

export const CertUploadSecure = ({ onEncoded }) => {
  const [fileName, setFileName] = useState('');
  const [encodedLen, setEncodedLen] = useState(0);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64Clean = typeof result === 'string' && result.includes(',') ? result.split(',')[1] : result;
      setEncodedLen(base64Clean.length);
      if (onEncoded) onEncoded(base64Clean, file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/60 p-5 text-center">
      <input
        type="file"
        id="admin-cert-input"
        onChange={handleFileUpload}
        accept=".jks,.keystore,.p12,.pfx,.mobileprovision"
        className="hidden"
      />
      <label htmlFor="admin-cert-input" className="cursor-pointer block">
        <span className="text-xs font-semibold text-white block">
          {fileName ? `Đã mã hóa: ${fileName}` : 'Chọn chứng chỉ (.jks, .p12, .pfx, .mobileprovision)'}
        </span>
        {encodedLen > 0 && (
          <span className="text-[10px] text-emerald-400 block mt-1">
            Chuỗi Base64 hợp lệ ({encodedLen} ký tự)
          </span>
        )}
      </label>
    </div>
  );
};
export default CertUploadSecure;
