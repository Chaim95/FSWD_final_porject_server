INSERT INTO Users (email, first_name, last_name, phone_number, type_of_user, password) VALUES ('admin@gmail.com', 'Admin','Admin_A', '0520000000','admin', '$2a$08$4clWDlx.YVWNzC9cQOz8Q.XsvBMBeO8.A/tYi0WaPhRYH9xkXgFoy');
INSERT INTO Users (email, first_name, last_name, phone_number, type_of_user, password) VALUES ('sadmin@gmail.com', 'Dani','Levi', '0521200100','show_admin', '$2a$08$4clWDlx.YVWNzC9cQOz8Q.XsvBMBeO8.A/tYi0WaPhRYH9xkXgFoy');
INSERT INTO Users (email, first_name, last_name, phone_number, type_of_user, password) VALUES ('user@gmail.com', 'Eli','Cohen', '0524284937','regular', '$2a$08$4clWDlx.YVWNzC9cQOz8Q.XsvBMBeO8.A/tYi0WaPhRYH9xkXgFoy');
INSERT INTO Users (email, first_name, last_name, phone_number, type_of_user, password) VALUES ('userq@gmail.com', 'Ben','Cohen', '0524284937','regular', '$2a$08$4clWDlx.YVWNzC9cQOz8Q.XsvBMBeO8.A/tYi0WaPhRYH9xkXgFoy');

INSERT INTO Places (name, address, parking_lot, type_of_place, areas, bus_lines) VALUES ('Pais Arena', 'Derech David Banbanishty 1, Jerusalem, Israel', True, 'closed', 'vip', '12,343,555,876');
INSERT INTO Places (name, address, parking_lot, type_of_place, areas, bus_lines) VALUES ('Yarkon Park', 'Tel Aviv-Yafo, Israel', True, 'open', 'vip,regular', '12,343,555,876');
INSERT INTO Places (name, address, parking_lot, type_of_place, areas, bus_lines) VALUES ('Caesarea Amphitheater', 'Sdot Yam, Israel', True, 'open', 'vip,regular', '12,343,555,876');


INSERT INTO Shows (date, hours_start, hours_finish, place_id, manager_id, prices, name, artist, seats_count, poster_url ) VALUES ('2024-12-12', '09:00', '12:00', 1, 2, 100,'Ishay Ribo - Arena','Ishay Ribo',1000, "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSW2KCBk9KWfb0d6Q81EES7EXXnNRkfGMTswXI8gISudDasJ2HtfpvLGSg1yY2zdCtaSGybx2V06K-EqDyDzJuvW2-8B357h515CcRIiw");
INSERT INTO Shows (date, hours_start, hours_finish, place_id, manager_id, prices, name, artist, seats_count, poster_url ) VALUES ('2024-12-15', '09:00', '12:00', 1, 2, 100,'Hanan Ben Ari- Arena','Hanan Ben Ari',1000, "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/%D7%97%D7%A0%D7%9F_%D7%91%D7%9F_%D7%90%D7%A8%D7%99_%D7%AA%D7%9E%D7%A8_%D7%97%D7%A0%D7%9F_%D7%9E%D7%A0%D7%95%D7%A8%D7%94_30.12.jpg/640px-%D7%97%D7%A0%D7%9F_%D7%91%D7%9F_%D7%90%D7%A8%D7%99_%D7%AA%D7%9E%D7%A8_%D7%97%D7%A0%D7%9F_%D7%9E%D7%A0%D7%95%D7%A8%D7%94_30.12.jpg");
