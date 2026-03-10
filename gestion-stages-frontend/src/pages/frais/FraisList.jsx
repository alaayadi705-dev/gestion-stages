import React, { useEffect, useState } from "react";

import {
  getFraisAPI,
  addFraisAPI,
  updateFraisAPI,
  deleteFraisAPI,
  getStagesAPI
} from "../../services/api";

import "../../styles/dashboard.css";

export default function FraisList() {

  const [data, setData] = useState([]);
  const [stages, setStages] = useState([]);

  const [form, setForm] = useState({
    id: null,
    stageId: "",
    type: "transport",
    montant: "",
    devise: "TND",
    support: ""
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {

      const frais = await getFraisAPI();
      const stagesList = await getStagesAPI();

      setData(frais || []);
      setStages(stagesList || []);

    } catch (error) {
      console.error(error);
    }
  };

  const submit = async () => {

    try {

      const payload = {
        type: form.type,
        montant: form.montant,
        devise: form.devise,
        support: form.support,
        stage: { id: form.stageId }
      };

      if (editing) {

        await updateFraisAPI(form.id, payload);

      } else {

        await addFraisAPI(payload);

      }

      reset();
      await load();

    } catch (error) {
      console.error(error);
    }

  };

  const edit = (f) => {

    setForm({
      id: f.id,
      stageId: f.stage?.id || "",
      type: f.type,
      montant: f.montant,
      devise: f.devise,
      support: f.support
    });

    setEditing(true);

  };

  const remove = async (id) => {

    if (window.confirm("Supprimer ce frais ?")) {

      await deleteFraisAPI(id);
      load();

    }

  };

  const reset = () => {

    setForm({
      id: null,
      stageId: "",
      type: "transport",
      montant: "",
      devise: "TND",
      support: ""
    });

    setEditing(false);

  };

  return (

    <div className="content">

      <div className="header">
        <h1>إدارة المصاريف</h1>
      </div>

      <div className="card">

        <div className="form-row">

          <select
            value={form.stageId}
            onChange={(e) =>
              setForm({ ...form, stageId: e.target.value })
            }
          >

            <option value="">اختر التربص</option>

            {stages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.intitule}
              </option>
            ))}

          </select>

          <select
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >

            <option value="transport">transport</option>
            <option value="hebergement">hebergement</option>
            <option value="timbre">timbre</option>
            <option value="autre">autre</option>

          </select>

          <input
            placeholder="montant"
            value={form.montant}
            onChange={(e) =>
              setForm({ ...form, montant: e.target.value })
            }
          />

          <input
            placeholder="devise"
            value={form.devise}
            onChange={(e) =>
              setForm({ ...form, devise: e.target.value })
            }
          />

          <input
            placeholder="support"
            value={form.support}
            onChange={(e) =>
              setForm({ ...form, support: e.target.value })
            }
          />

          <button
            className="add-btn"
            onClick={submit}
          >
            {editing ? "تعديل" : "إضافة"}
          </button>

        </div>

        <table>

          <thead>

            <tr>

              <th>ID</th>
              <th>التربص</th>
              <th>النوع</th>
              <th>المبلغ</th>
              <th>العملة</th>
              <th>الدعم</th>
              <th>إجراءات</th>

            </tr>

          </thead>

          <tbody>

            {data.length === 0 ? (

              <tr>
                <td colSpan="7">لا توجد مصاريف</td>
              </tr>

            ) : (

              data.map((f) => (

                <tr key={f.id}>

                  <td>{f.id}</td>
                  <td>{f.stage?.intitule}</td>
                  <td>{f.type}</td>
                  <td>{f.montant}</td>
                  <td>{f.devise}</td>
                  <td>{f.support}</td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() => edit(f)}
                    >
                      تعديل
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => remove(f.id)}
                    >
                      حذف
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>

  );

}