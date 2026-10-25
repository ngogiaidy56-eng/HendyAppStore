/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Bảng điều khiển nhập liệu và theo dõi tiến độ đồng bộ 26 biến bảo mật
 */
import React from 'react';

export const AutomationSecretsForm = ({ secrets = [], onSync }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Quản lý Tập Trung 26 Secrets & Variables</h2>
        <button
          onClick={onSync}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition"
        >
          Đồng bộ tất cả sang GitHub API
        </button>
      </div>
      <div className="text-xs text-slate-400">
        Đang quản lý {secrets.length} biến cấu hình trên GitHub Actions & Cloudflare Workers.
      </div>
    </div>
  );
};
export default AutomationSecretsForm;
