import React, { useEffect, useMemo, useRef, useState } from 'react';
import { imagesByFilename } from '../../utils/products/images';
import { mockProductsDatabase } from '../../utils/products/mockDatabase';
import api from '../../apis/api';

// 로컬 오버레이 저장 키 (Mock 보완용)
const OVERLAY_KEY = 'customProductsOverlay';
const readOverlay = () => {
  try { return JSON.parse(localStorage.getItem(OVERLAY_KEY) || '[]'); } catch { return []; }
};
const writeOverlay = (items) => {
  try { localStorage.setItem(OVERLAY_KEY, JSON.stringify(items)); } catch {}
};
const mergeOverlay = (incoming = []) => {
  const prev = readOverlay();
  const map = new Map();
  [...prev, ...incoming].forEach(p => {
    const key = p?.no ?? p?.sharedCode ?? p?.name;
    if (key != null) map.set(String(key), p);
  });
  const arr = Array.from(map.values());
  writeOverlay(arr);
  return arr;
};

const initialForm = { sharedCode: '', name: '', price: '', description: '', imageFile: null, imageName: '', imageUrl: '', category: '용품' };

export default function ProductCreate() {
  const [form, setForm] = useState(initialForm);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  // 편집 시 폼으로 스크롤/포커스 유도 + 파일선택 커스텀 버튼용 ref
  const formRef = useRef(null);
  const nameInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // 초기 데이터 로드: Mock + Overlay 병합
  useEffect(() => {
    const base = [...mockProductsDatabase];
    const overlay = readOverlay();
    const byKey = new Map(base.map(p => [String(p.no), p]));
    overlay.forEach(p => {
      const key = String(p.no ?? p.sharedCode ?? p.name);
      if (!byKey.has(String(p.no))) base.push(p);
    });
    setItems(base);
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter(p => String(p.no).includes(q) || (p.name || '').toLowerCase().includes(q) || (p.sharedCode || '').toLowerCase().includes(q));
  }, [items, filter]);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm(prev => ({ ...prev, imageFile: file, imageUrl: e.target.result, imageName: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => setForm(initialForm);

  const nextNo = () => {
    const max = items.reduce((m, p) => Math.max(m, Number(p.no) || 0), 0);
    return max + 1;
  };

  const addItem = async () => {
    if (!form.name || !form.price || !(form.imageUrl || form.imageName)) {
      alert('제품명, 가격, 이미지를 입력하세요.');
      return;
    }
    // 1) 서버 시도 (멀티파트)
    let saved = null;
    try {
      const fd = new FormData();
      fd.append('sharedCode', form.sharedCode || '');
      fd.append('name', form.name);
      fd.append('price', String(form.price));
  fd.append('category', form.category || '용품');
  fd.append('description', form.description || '');
      if (form.imageFile) fd.append('image', form.imageFile);
      // 추정 엔드포인트: 실패 시 캐치로 폴백
      const { data } = await api.post('/products/api/create', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data?.success && data?.product) {
        saved = data.product;
      }
    } catch {}

    // 2) 폴백: 로컬 오버레이 저장(DataURL)
    const newItem = saved || {
      no: nextNo(),
      sharedCode: form.sharedCode || `SH-${crypto.randomUUID().slice(0,8)}`,
      name: form.name,
      price: Number(form.price),
      originalPrice: Number(form.price),
      category: form.category || '용품',
      imageUrl: saved?.imageUrl || form.imageUrl, // DataURL or server URL
  description: form.description || '',
      stock: 0,
      status: '판매중',
      rating: 0,
      reviewCount: '0개 리뷰',
      isNew: true,
      discount: '',
      views: 0,
      likes: 0,
      favorites: 0
    };
    const updated = [...items, newItem];
    setItems(updated);
    mergeOverlay([newItem]);
    resetForm();
  };

  const removeItem = async (no) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    try {
      await api.delete(`/products/api/${no}`);
    } catch {}
    const updated = items.filter(p => String(p.no) !== String(no));
    setItems(updated);
    const overlay = readOverlay().filter(p => String(p.no) !== String(no));
    writeOverlay(overlay);
  };

  const startEdit = (item) => {
    setEditingId(item.no);
    setForm({ sharedCode: item.sharedCode || '', name: item.name, price: String(item.price), description: item.description || '', imageFile: null, imageName: '', imageUrl: item.imageUrl, category: item.category || '용품' });
    // 폼 영역으로 스크롤 및 제품명 입력 포커스
    setTimeout(() => {
      try {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        nameInputRef.current?.focus();
      } catch {}
    }, 0);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    // 서버 시도
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', String(form.price));
  fd.append('category', form.category || '용품');
  fd.append('description', form.description || '');
      if (form.imageFile) fd.append('image', form.imageFile);
      await api.put(`/products/api/${editingId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    } catch {}

  const updated = items.map(p => String(p.no) === String(editingId) ? { ...p, name: form.name, price: Number(form.price), category: form.category, description: form.description || p.description, imageUrl: form.imageUrl || p.imageUrl } : p);
    setItems(updated);
    mergeOverlay(updated.filter(p => Number(p.no) > 55));
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="tw:max-w-5xl tw:mx-auto tw:px-4 tw:py-8">
      <h1 className="tw:text-2xl tw:font-bold tw:mb-4">상품 등록</h1>

      {/* 등록/수정 폼 */}
  <div ref={formRef} className="tw:bg-white tw:border tw:rounded-lg tw:p-4 tw:mb-6">
        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-4">
          <div>
            <label className="tw:block tw:text-sm tw:text-zinc-600 tw:mb-1">제품공유번호</label>
            <input className="tw:w-full tw:border tw:rounded tw:px-3 tw:py-2" value={form.sharedCode} onChange={(e)=>setForm(prev=>({...prev, sharedCode:e.target.value}))} placeholder="예) SH-1234ABCD" />
          </div>
          <div>
            <label className="tw:block tw:text-sm tw:text-zinc-600 tw:mb-1">제품명</label>
            <input ref={nameInputRef} className="tw:w-full tw:border tw:rounded tw:px-3 tw:py-2" value={form.name} onChange={(e)=>setForm(prev=>({...prev, name:e.target.value}))} />
          </div>
          <div>
            <label className="tw:block tw:text-sm tw:text-zinc-600 tw:mb-1">제품가격</label>
            <input type="number" className="tw:w-full tw:border tw:rounded tw:px-3 tw:py-2" value={form.price} onChange={(e)=>setForm(prev=>({...prev, price:e.target.value}))} />
          </div>
          <div className="md:tw:col-span-2">
            <label className="tw:block tw:text-sm tw:text-zinc-600 tw:mb-1">제품 설명</label>
            <textarea className="tw:w-full tw:min-h-[90px] tw:border tw:rounded tw:px-3 tw:py-2" value={form.description} onChange={(e)=>setForm(prev=>({...prev, description:e.target.value}))} placeholder="제품 특징/사이즈/사용법 등" />
          </div>
          <div>
            <label className="tw:block tw:text-sm tw:text-zinc-600 tw:mb-1">카테고리</label>
            <select className="tw:w-full tw:border tw:rounded tw:px-3 tw:py-2" value={form.category} onChange={(e)=>setForm(prev=>({...prev, category:e.target.value}))}>
              {['사료','용품','장난감','산책','액세서리','위생용품','미용용품'].map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:tw:col-span-2">
            <label className="tw:block tw:text-sm tw:text-zinc-600 tw:mb-1">제품 이미지</label>
            {/* 숨겨진 실제 파일 인풋 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="tw:hidden"
              onChange={(e)=>handleFile(e.target.files?.[0])}
            />
            {/* 커스텀 파일선택 UI: 버튼 + placeholder 스타일 표시 */}
            <div className="tw:flex tw:items-center tw:gap-3">
              <button
                type="button"
                className="tw:bg-[#FF9999] tw:text-white tw:px-4 tw:py-2 tw:rounded tw:whitespace-nowrap"
                onClick={()=>fileInputRef.current?.click()}
              >
                파일 선택
              </button>
              <div className="tw:flex-1 tw:min-w-0">
                {(() => {
                  const selectedName = form.imageFile?.name || form.imageName || '';
                  const hasName = !!selectedName;
                  return (
                    <div
                      className={`tw:w-full tw:border tw:rounded tw:px-3 tw:py-2 tw:text-sm tw:bg-white tw:truncate ${hasName ? 'tw:text-zinc-800' : 'tw:text-zinc-400'}`}
                      title={hasName ? selectedName : undefined}
                    >
                      {hasName ? selectedName : '선택된 파일 없음'}
                    </div>
                  );
                })()}
              </div>
            </div>
            {form.imageUrl && (
              <div className="tw:mt-2">
                <img src={form.imageUrl} alt="preview" className="tw:w-32 tw:h-32 tw:object-cover tw:border tw:rounded" />
              </div>
            )}
          </div>
        </div>
        <div className="tw:mt-4 tw:flex tw:gap-2">
          {editingId ? (
            <>
              <button className="tw:bg-[#FF9999] tw:text-white tw:px-4 tw:py-2 tw:rounded" onClick={saveEdit}>수정 저장</button>
              <button className="tw:bg-zinc-200 tw:px-4 tw:py-2 tw:rounded" onClick={()=>{ setEditingId(null); resetForm(); }}>취소</button>
            </>
          ) : (
            <button className="tw:bg-[#FF9999] tw:text-white tw:px-4 tw:py-2 tw:rounded" onClick={addItem}>등록</button>
          )}
        </div>
      </div>

      {/* 검색/필터 */}
      <div className="tw:flex tw:items-center tw:justify-between tw:mb-3">
        <input className="tw:w-64 tw:border tw:rounded tw:px-3 tw:py-2" placeholder="제품명/번호/공유번호 검색" value={filter} onChange={(e)=>setFilter(e.target.value)} />
      </div>

      {/* 리스트 */}
      <div className="tw:bg-white tw:border tw:rounded-lg tw:p-2">
        <table className="tw:w-full tw:text-sm">
          <thead>
            <tr className="tw:text-left tw:text-zinc-500">
              <th className="tw:p-2">번호</th>
              <th className="tw:p-2">이미지</th>
              <th className="tw:p-2">제품명</th>
              <th className="tw:p-2">가격</th>
              <th className="tw:p-2">카테고리</th>
              <th className="tw:p-2">설명</th>
              <th className="tw:p-2">공유번호</th>
              <th className="tw:p-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.no} className="tw:border-t">
                <td className="tw:p-2">{p.no}</td>
                <td className="tw:p-2">
                  <img src={p.imageUrl} alt={p.name} className="tw:w-12 tw:h-12 tw:object-cover tw:border tw:rounded" />
                </td>
                <td className="tw:p-2">{p.name}</td>
                <td className="tw:p-2">{Number(p.price).toLocaleString()}원</td>
                <td className="tw:p-2">{p.category}</td>
                <td className="tw:p-2 tw:max-w-[280px] tw:truncate" title={p.description}>{p.description || '-'}</td>
                <td className="tw:p-2">{p.sharedCode || '-'}</td>
                <td className="tw:p-2">
                  <div className="tw:flex tw:gap-2">
                    <button className="tw:px-3 tw:py-1 tw:bg-zinc-200 tw:rounded" onClick={()=>startEdit(p)}>수정</button>
                    <button className="tw:px-3 tw:py-1 tw:bg-red-500 tw:text-white tw:rounded" onClick={()=>removeItem(p.no)}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
